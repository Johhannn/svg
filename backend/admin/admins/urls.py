from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserDetailsViewSet,
    PageViewSet,
    PagePermissionViewSet,
    CommentViewSet,
    CommentHistoryViewSet,
    PasswordResetOTPViewSet,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'users', UserDetailsViewSet)
router.register(r'pages', PageViewSet)
router.register(r'page-permissions', PagePermissionViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'comment-histories', CommentHistoryViewSet, basename='comment-histories')
router.register(r'password-reset-otps', PasswordResetOTPViewSet, basename='password-reset-otps')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
