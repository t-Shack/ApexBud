from rest_framework import serializers
from .models import Question, Option, Exam, ExamQuestion


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Option
        fields = ['id', 'option_text', 'is_correct']


class OptionStudentSerializer(serializers.ModelSerializer):
    """Hides is_correct from students."""
    class Meta:
        model  = Option
        fields = ['id', 'option_text']


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model  = Question
        fields = ['id', 'subject', 'question_text', 'question_type', 'options', 'created_at']
        read_only_fields = ['id', 'created_at']


class CreateQuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model  = Question
        fields = ['subject', 'question_text', 'question_type', 'options']

    def create(self, validated_data):
        options_data = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        Option.objects.bulk_create([
            Option(question=question, **opt) for opt in options_data
        ])
        return question


# ── ExamQuestion serializers ──────────────────────────────────────────────────

class ExamQuestionStaffSerializer(serializers.ModelSerializer):
    """Admin / Teacher: sees marks."""
    question = QuestionSerializer(read_only=True)

    class Meta:
        model  = ExamQuestion
        fields = ['id', 'question', 'order', 'marks']


class ExamQuestionStudentSerializer(serializers.ModelSerializer):
    """Student: marks field is EXCLUDED."""
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    question_type = serializers.CharField(source='question.question_type', read_only=True)
    options       = OptionStudentSerializer(source='question.options', many=True, read_only=True)

    class Meta:
        model  = ExamQuestion
        fields = ['id', 'order', 'question_text', 'question_type', 'options']


class AddExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ExamQuestion
        fields = ['question', 'order', 'marks']


# ── Exam serializers ──────────────────────────────────────────────────────────

class ExamSerializer(serializers.ModelSerializer):
    total_marks    = serializers.IntegerField(read_only=True)
    question_count = serializers.IntegerField(read_only=True)
    subject_name   = serializers.CharField(source='subject.name', read_only=True)
    class_name     = serializers.CharField(source='exam_class.name', read_only=True)

    class Meta:
        model  = Exam
        fields = [
            'id', 'title', 'subject', 'subject_name', 'exam_class', 'class_name',
            'duration_minutes', 'start_time', 'end_time',
            'status', 'total_marks', 'question_count', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
