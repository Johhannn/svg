from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import User_details, Page, PagePermission, Comment, CommentHistory, PasswordResetOTP
from .serializers import (
    UserDetailsSerializer,
    PageSerializer,
    PagePermissionSerializer,
    CommentSerializer,
    CommentHistorySerializer,
    PasswordResetOTPSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', '') == 'super_admin'

class UserDetailsViewSet(viewsets.ModelViewSet):
    queryset = User_details.objects.all()
    serializer_class = UserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Super admin sees all, users see themselves only
        user = self.request.user
        if getattr(user, 'role', '') == 'super_admin':
            return User_details.objects.all()
        return User_details.objects.filter(id=user.id)

    def perform_update(self, serializer):
        # Do not allow role or groups/user_permissions changes by users themselves
        serializer.save()

class PageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]

class PagePermissionViewSet(viewsets.ModelViewSet):
    queryset = PagePermission.objects.all()
    serializer_class = PagePermissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', '') == 'super_admin':
            return PagePermission.objects.all()
        return PagePermission.objects.filter(user=user)

    def perform_create(self, serializer):
        # If you want to restrict user field or auto-assign:
        serializer.save()

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.filter(is_deleted=False)
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        comment = self.get_object()
        # Save history before update
        CommentHistory.objects.create(
            comment=comment,
            changed_by=self.request.user,
            previous_text=comment.text
        )
        serializer.save()

    def perform_destroy(self, instance):
        # Soft delete
        instance.is_deleted = True
        instance.save()

class CommentHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CommentHistory.objects.all()
    serializer_class = CommentHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        comment_id = self.request.query_params.get('comment')
        if comment_id:
            return CommentHistory.objects.filter(comment_id=comment_id)
        return CommentHistory.objects.none()

class PasswordResetOTPViewSet(viewsets.ModelViewSet):
    queryset = PasswordResetOTP.objects.all()
    serializer_class = PasswordResetOTPSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def verify(self, request):
        user_email = request.data.get('email')
        otp = request.data.get('otp')
        try:
            user = User_details.objects.get(email=user_email)
            otp_obj = PasswordResetOTP.objects.filter(user=user, otp=otp).last()
            if otp_obj and otp_obj.is_valid():
                return Response({"valid": True})
            else:
                return Response({"valid": False}, status=status.HTTP_400_BAD_REQUEST)
        except User_details.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
