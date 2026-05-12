from rest_framework import serializers
from .models import Class, Subject


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Class
        fields = ['id', 'name', 'level', 'created_at']
        read_only_fields = ['id', 'created_at']


class SubjectSerializer(serializers.ModelSerializer):
    class_name   = serializers.CharField(source='subject_class.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.full_name', read_only=True)

    class Meta:
        model  = Subject
        fields = ['id', 'name', 'subject_class', 'class_name', 'teacher', 'teacher_name', 'created_at']
        read_only_fields = ['id', 'created_at']
