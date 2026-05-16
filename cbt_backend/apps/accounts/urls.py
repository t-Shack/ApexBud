from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, TeacherViewSet

router = DefaultRouter()
router.register('students', StudentViewSet, basename='students')
router.register('teachers', TeacherViewSet, basename='teachers')

urlpatterns = [
    path('', include(router.urls)),
]
