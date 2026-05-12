from django.contrib import admin
import config.admin  # noqa: F401 — applies site branding
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from apps.accounts.views import LoginView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Apps
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/academics/', include('apps.academics.urls')),
    path('api/exams/', include('apps.exams.urls')),
    path('api/results/', include('apps.results.urls')),
]
