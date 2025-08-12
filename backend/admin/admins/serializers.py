from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User_details, Page, PagePermission, Comment, CommentHistory, PasswordResetOTP


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_details
        fields = ['id', 'email', 'role', 'groups', 'user_permissions']
        read_only_fields = ['groups', 'user_permissions']


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'key', 'name']


class PagePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagePermission
        fields = ['id', 'user', 'page', 'can_view', 'can_create', 'can_edit', 'can_delete']
        # You may want to restrict 'user' to the logged-in user in views or override validate


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'page', 'author', 'text', 'created_at', 'modified_at', 'is_deleted']
        read_only_fields = ['author', 'created_at', 'modified_at']


class CommentHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.StringRelatedField()
    class Meta:
        model = CommentHistory
        fields = ['id', 'comment', 'changed_by', 'previous_text', 'changed_at']


class PasswordResetOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetOTP
        fields = ['user', 'otp', 'created_at']
        read_only_fields = ['created_at']
