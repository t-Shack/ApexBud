from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import IsAdmin, IsAdminOrTeacher
from .models import Class, Subject
from .serializers import ClassSerializer, SubjectSerializer


class ClassViewSet(ModelViewSet):
    queryset           = Class.objects.all()
    serializer_class   = ClassSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdmin()]


class SubjectViewSet(ModelViewSet):
    queryset         = Subject.objects.select_related('subject_class', 'teacher__user').all()
    serializer_class = SubjectSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdmin()]
