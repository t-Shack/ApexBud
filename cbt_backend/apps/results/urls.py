from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StartExamView, SubmitExamView, ResultViewSet

router = DefaultRouter()
router.register('scores', ResultViewSet, basename='results')

urlpatterns = [
    path('', include(router.urls)),
    path('start/<uuid:exam_id>/',       StartExamView.as_view(),  name='start-exam'),
    path('submit/<uuid:session_id>/',   SubmitExamView.as_view(), name='submit-exam'),
]
