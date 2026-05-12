from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.accounts.permissions import IsAdminOrTeacher, IsAdmin
from .models import Question, Exam, ExamQuestion
from .serializers import (
    QuestionSerializer, CreateQuestionSerializer,
    ExamSerializer, AddExamQuestionSerializer,
    ExamQuestionStaffSerializer,
)


class QuestionViewSet(ModelViewSet):
    queryset = Question.objects.select_related('subject', 'created_by').prefetch_related('options').all()
    permission_classes = [IsAdminOrTeacher]

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateQuestionSerializer
        return QuestionSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ExamViewSet(ModelViewSet):
    queryset = Exam.objects.select_related('subject', 'exam_class', 'created_by').all()
    serializer_class = ExamSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdminOrTeacher()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrTeacher],
            url_path='add-question')
    def add_question(self, request, pk=None):
        exam = self.get_object()
        serializer = AddExamQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        eq = serializer.save(exam=exam)
        return Response(ExamQuestionStaffSerializer(eq).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], permission_classes=[IsAdminOrTeacher],
            url_path='questions')
    def questions(self, request, pk=None):
        exam = self.get_object()
        qs   = exam.exam_questions.select_related('question').prefetch_related('question__options')
        return Response(ExamQuestionStaffSerializer(qs, many=True).data)
