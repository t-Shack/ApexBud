from django.utils import timezone
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.accounts.permissions import IsStudent, IsAdminOrTeacher
from apps.exams.models import Exam, ExamQuestion
from apps.exams.serializers import ExamQuestionStudentSerializer
from .models import ExamSession, StudentAnswer, Result
from .serializers import StartExamSerializer, SubmitAnswerSerializer, ResultSerializer


class StartExamView(APIView):
    """Student starts an exam → creates a session and returns questions (no marks)."""
    permission_classes = [IsStudent]

    def post(self, request, exam_id):
        student = request.user.student_profile
        try:
            exam = Exam.objects.get(id=exam_id, status=Exam.Status.ACTIVE)
        except Exam.DoesNotExist:
            return Response({'detail': 'Exam not found or not active.'}, status=status.HTTP_404_NOT_FOUND)

        if exam.exam_class != student.student_class:
            return Response({'detail': 'This exam is not for your class.'}, status=status.HTTP_403_FORBIDDEN)

        session, created = ExamSession.objects.get_or_create(student=student, exam=exam)
        if not created and session.status != ExamSession.Status.IN_PROGRESS:
            return Response({'detail': 'You have already completed this exam.'}, status=status.HTTP_400_BAD_REQUEST)

        questions = ExamQuestion.objects.filter(exam=exam).select_related(
            'question'
        ).prefetch_related('question__options').order_by('order')

        return Response({
            'session_id':       str(session.id),
            'exam_title':       exam.title,
            'duration_minutes': exam.duration_minutes,
            'questions':        ExamQuestionStudentSerializer(questions, many=True).data,
        })


class SubmitExamView(APIView):
    """Student submits all answers → auto-marks → creates Result."""
    permission_classes = [IsStudent]

    @transaction.atomic
    def post(self, request, session_id):
        student = request.user.student_profile
        try:
            session = ExamSession.objects.select_related('exam').get(
                id=session_id, student=student, status=ExamSession.Status.IN_PROGRESS
            )
        except ExamSession.DoesNotExist:
            return Response({'detail': 'Session not found or already submitted.'}, status=status.HTTP_404_NOT_FOUND)

        answers_data = request.data.get('answers', [])
        total_score  = 0
        total_marks  = 0

        exam_questions = {
            eq.question_id: eq
            for eq in ExamQuestion.objects.filter(exam=session.exam)
        }

        answers_to_create = []
        for item in answers_data:
            s = SubmitAnswerSerializer(data=item)
            s.is_valid(raise_exception=True)
            q_id   = s.validated_data['question_id']
            opt_id = s.validated_data['selected_option_id']

            eq = exam_questions.get(q_id)
            if not eq:
                continue

            from apps.exams.models import Option
            is_correct     = False
            marks_obtained = 0

            if opt_id:
                try:
                    option     = Option.objects.get(id=opt_id, question_id=q_id)
                    is_correct = option.is_correct
                    if is_correct:
                        marks_obtained = eq.marks
                except Option.DoesNotExist:
                    pass

            total_marks += eq.marks
            total_score += marks_obtained
            answers_to_create.append(StudentAnswer(
                session=session, question_id=q_id,
                selected_option_id=opt_id,
                is_correct=is_correct, marks_obtained=marks_obtained,
            ))

        StudentAnswer.objects.bulk_create(answers_to_create, ignore_conflicts=True)

        session.status       = ExamSession.Status.SUBMITTED
        session.submitted_at = timezone.now()
        session.save()

        Result.objects.create(
            session=session, student=student,
            exam=session.exam,
            total_score=total_score, total_marks=total_marks,
        )

        return Response({'detail': 'Exam submitted successfully.'}, status=status.HTTP_200_OK)


class ResultViewSet(ReadOnlyModelViewSet):
    """Admin / Teacher only — view scores."""
    serializer_class   = ResultSerializer
    permission_classes = [IsAdminOrTeacher]

    def get_queryset(self):
        qs = Result.objects.select_related('student__user', 'exam').all()
        exam_id = self.request.query_params.get('exam_id')
        if exam_id:
            qs = qs.filter(exam_id=exam_id)
        return qs
