from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, ExamViewSet

router = DefaultRouter()
router.register('questions', QuestionViewSet, basename='questions')
router.register('exams',     ExamViewSet,     basename='exams')

urlpatterns = [
    path('', include(router.urls)),
]
