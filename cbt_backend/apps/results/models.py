import uuid
from django.db import models
from django.utils import timezone


class ExamSession(models.Model):
    class Status(models.TextChoices):
        IN_PROGRESS = 'in_progress', 'In Progress'
        SUBMITTED   = 'submitted',   'Submitted'
        TIMED_OUT   = 'timed_out',   'Timed Out'

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student      = models.ForeignKey('accounts.Student', on_delete=models.CASCADE, related_name='sessions')
    exam         = models.ForeignKey('exams.Exam', on_delete=models.CASCADE, related_name='sessions')
    started_at   = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    status       = models.CharField(max_length=20, choices=Status.choices, default=Status.IN_PROGRESS)

    class Meta:
        db_table       = 'exam_sessions'
        unique_together = [['student', 'exam']]  # one attempt per student per exam

    def __str__(self):
        return f"{self.student} — {self.exam.title} ({self.status})"


class StudentAnswer(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session         = models.ForeignKey(ExamSession, on_delete=models.CASCADE, related_name='answers')
    question        = models.ForeignKey('exams.Question', on_delete=models.CASCADE, related_name='student_answers')
    selected_option = models.ForeignKey(
        'exams.Option', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='student_answers'
    )
    is_correct      = models.BooleanField(default=False)
    marks_obtained  = models.PositiveIntegerField(default=0)

    class Meta:
        db_table       = 'student_answers'
        unique_together = [['session', 'question']]

    def __str__(self):
        return f"Session {self.session_id} | Q {self.question_id} | Correct: {self.is_correct}"


class Result(models.Model):
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session      = models.OneToOneField(ExamSession, on_delete=models.CASCADE, related_name='result')
    student      = models.ForeignKey('accounts.Student', on_delete=models.CASCADE, related_name='results')
    exam         = models.ForeignKey('exams.Exam', on_delete=models.CASCADE, related_name='results')
    total_score  = models.PositiveIntegerField(default=0)
    total_marks  = models.PositiveIntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table       = 'results'
        unique_together = [['student', 'exam']]

    def __str__(self):
        return f"{self.student} | {self.exam.title} | {self.total_score}/{self.total_marks}"

    @property
    def percentage(self):
        if self.total_marks == 0:
            return 0
        return round((self.total_score / self.total_marks) * 100, 2)
