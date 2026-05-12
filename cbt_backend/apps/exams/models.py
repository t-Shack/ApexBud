import uuid
from django.db import models
from django.core.validators import MinValueValidator


class Question(models.Model):
    class QuestionType(models.TextChoices):
        MCQ        = 'mcq',        'Multiple Choice'
        TRUE_FALSE = 'true_false', 'True / False'

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subject       = models.ForeignKey('academics.Subject', on_delete=models.CASCADE, related_name='questions')
    created_by    = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.MCQ)
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'questions'
        ordering = ['-created_at']

    def __str__(self):
        return self.question_text[:80]


class Option(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question    = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=500)
    is_correct  = models.BooleanField(default=False)

    class Meta:
        db_table = 'options'

    def __str__(self):
        return f"{self.option_text} ({'correct' if self.is_correct else 'wrong'})"


class Exam(models.Model):
    class Status(models.TextChoices):
        DRAFT     = 'draft',     'Draft'
        ACTIVE    = 'active',    'Active'
        COMPLETED = 'completed', 'Completed'

    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title            = models.CharField(max_length=200)
    subject          = models.ForeignKey('academics.Subject', on_delete=models.CASCADE, related_name='exams')
    exam_class       = models.ForeignKey('academics.Class', on_delete=models.CASCADE, related_name='exams')
    created_by       = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='exams')
    duration_minutes = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    start_time       = models.DateTimeField()
    end_time         = models.DateTimeField()
    status           = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'exams'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} — {self.exam_class.name}"

    @property
    def total_marks(self):
        return self.exam_questions.aggregate(
            total=models.Sum('marks')
        )['total'] or 0

    @property
    def question_count(self):
        return self.exam_questions.count()


class ExamQuestion(models.Model):
    id       = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam     = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='exam_questions')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='exam_questions')
    order    = models.PositiveIntegerField(default=0)
    marks    = models.PositiveIntegerField(validators=[MinValueValidator(1)], default=1)

    class Meta:
        db_table       = 'exam_questions'
        unique_together = [['exam', 'question']]
        ordering        = ['order']

    def __str__(self):
        return f"{self.exam.title} | Q{self.order} | {self.marks} mark(s)"
