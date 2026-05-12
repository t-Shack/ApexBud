from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClassViewSet, SubjectViewSet

router = DefaultRouter()
router.register('classes',  ClassViewSet,   basename='classes')
router.register('subjects', SubjectViewSet, basename='subjects')

urlpatterns = [
    path('', include(router.urls)),
]
