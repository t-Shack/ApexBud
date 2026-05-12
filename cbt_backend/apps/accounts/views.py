from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from .models import User, Student, Teacher
from .serializers import (
    LoginSerializer, UserSerializer,
    StudentSerializer, CreateStudentSerializer,
    TeacherSerializer, CreateTeacherSerializer,
)
from .permissions import IsAdmin


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user':    UserSerializer(user).data,
        })


class StudentViewSet(ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = Student.objects.select_related('user', 'student_class').all()

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateStudentSerializer
        return StudentSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)


class TeacherViewSet(ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = Teacher.objects.select_related('user').all()

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateTeacherSerializer
        return TeacherSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateTeacherSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        teacher = serializer.save()
        return Response(TeacherSerializer(teacher).data, status=status.HTTP_201_CREATED)
