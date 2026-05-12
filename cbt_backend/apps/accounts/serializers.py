from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Student, Teacher


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid credentials.')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')
        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'first_name', 'last_name', 'email', 'role', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = User
        fields = ['first_name', 'last_name', 'email', 'password', 'role']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class StudentSerializer(serializers.ModelSerializer):
    user       = UserSerializer(read_only=True)
    class_name = serializers.CharField(source='student_class.name', read_only=True)

    class Meta:
        model  = Student
        fields = ['id', 'user', 'reg_number', 'student_class', 'class_name', 'created_at']
        read_only_fields = ['id', 'created_at']


class CreateStudentSerializer(serializers.Serializer):
    first_name    = serializers.CharField()
    last_name     = serializers.CharField()
    email         = serializers.EmailField()
    password      = serializers.CharField(write_only=True, min_length=8)
    reg_number    = serializers.CharField()
    student_class = serializers.UUIDField()

    def create(self, validated_data):
        from apps.academics.models import Class
        student_class = Class.objects.get(id=validated_data.pop('student_class'))
        user = User.objects.create_user(
            email=validated_data.pop('email'),
            password=validated_data.pop('password'),
            first_name=validated_data.pop('first_name'),
            last_name=validated_data.pop('last_name'),
            role=User.Role.STUDENT,
        )
        return Student.objects.create(
            user=user,
            student_class=student_class,
            reg_number=validated_data['reg_number'],
        )


class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = Teacher
        fields = ['id', 'user', 'staff_id', 'created_at']
        read_only_fields = ['id', 'created_at']


class CreateTeacherSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name  = serializers.CharField()
    email      = serializers.EmailField()
    password   = serializers.CharField(write_only=True, min_length=8)
    staff_id   = serializers.CharField()

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data.pop('email'),
            password=validated_data.pop('password'),
            first_name=validated_data.pop('first_name'),
            last_name=validated_data.pop('last_name'),
            role=User.Role.TEACHER,
        )
        return Teacher.objects.create(user=user, staff_id=validated_data['staff_id'])
