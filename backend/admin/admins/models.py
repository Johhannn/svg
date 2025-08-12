from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'super_admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class User_details(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('user', 'Regular User')
    ]

    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        "auth.Group",
        verbose_name=_("groups"),
        blank=True,
        help_text=_("The groups this user belongs to."),
        related_name="user_details_set",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        verbose_name=_("user permissions"),
        blank=True,
        help_text=_("Specific permissions for this user."),
        related_name="user_details_permissions_set",
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role']

    def __str__(self):
        return self.email


class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User_details, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() < self.created_at + timedelta(minutes=10)


class Page(models.Model):
    KEY_CHOICES = [
        ("products", "Products List"),
        ("marketing", "Marketing List"),
        ("orders", "Orders List"),
        ("media", "Media Plans"),
        ("offers", "Offer Pricing SKUs"),
        ("clients", "Clients List"),
        ("suppliers", "Suppliers List"),
        ("customer support", "Customer Support"),
        ("sales report", "Sales Report"),
        ("finance", "Finance & Accounting")
    ]
    key = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name


class PagePermission(models.Model):
    user = models.ForeignKey(User_details, on_delete=models.CASCADE, related_name="page_permissions")
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    can_view = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        unique_together = ("user", "page")


class Comment(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User_details, on_delete=models.SET_NULL, null=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)


class CommentHistory(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="histories")
    changed_by = models.ForeignKey(User_details, on_delete=models.SET_NULL, null=True)
    previous_text = models.TextField()
    changed_at = models.DateTimeField(auto_now_add=True)
