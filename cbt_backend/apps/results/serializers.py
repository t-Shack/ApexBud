from rest_framework import serializers
from .models import ExamSession, StudentAnswer, Result


class SubmitAnswerSerializer(serializers.Serializer):
    question_id        = serializers.UUIDField()
    selected_option_id = serializers.UUIDField(allow_null=True)


class StartExamSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ExamSession
        fields = ['id', 'exam', 'started_at', 'status']
        read_only_fields = ['id', 'started_at', 'status']


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model  = StudentAnswer
        fields = ['id', 'question', 'selected_option', 'is_correct', 'marks_obtained']


class ResultSerializer(serializers.ModelSerializer):
    """Staff only — includes score details."""
    student_name = serializers.CharField(source='student.user.full_name', read_only=True)
    reg_number   = serializers.CharField(source='student.reg_number', read_only=True)
    exam_title   = serializers.CharField(source='exam.title', read_only=True)
    percentage   = serializers.FloatField(read_only=True)

    class Meta:
        model  = Result
        fields = [
            'id', 'student_name', 'reg_number', 'exam_title',
            'total_score', 'total_marks', 'percentage', 'created_at',
        ]
        read_only_fields = fields
