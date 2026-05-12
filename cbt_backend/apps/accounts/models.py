import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', User.Role.ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        ADMIN   = 'admin',   'Admin'
        TEACHER = 'teacher', 'Teacher'
        STUDENT = 'student', 'Student'

    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=150)
    last_name  = models.CharField(max_length=150)
    email      = models.EmailField(unique=True)
    role       = models.CharField(max_length=20, choices=Role.choices)
    is_active  = models.BooleanField(default=True)
    is_staff   = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role']

    objects = UserManager()

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.role})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_teacher(self):
        return self.role == self.Role.TEACHER

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT


class Student(models.Model):
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user          = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    student_class = models.ForeignKey(
        'academics.Class', on_delete=models.SET_NULL,
        null=True, related_name='students'
    )
    reg_number    = models.CharField(max_length=50, unique=True)
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'students'

    def __str__(self):
        return f"{self.user.full_name} — {self.reg_number}"


class Teacher(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user       = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    staff_id   = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teachers'

    def __str__(self):
        return f"{self.user.full_name} — {self.staff_id}"
