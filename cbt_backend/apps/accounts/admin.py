from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Student, Teacher


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['full_name', 'email', 'role', 'is_active', 'created_at']
    list_filter   = ['role', 'is_active']
    search_fields = ['first_name', 'last_name', 'email']
    ordering      = ['-created_at']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'email', 'password')
        }),
        ('Role & Access', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Permissions', {
            'classes': ('collapse',),
            'fields': ('groups', 'user_permissions'),
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'email', 'password1', 'password2', 'role'),
        }),
    )


class StudentInline(admin.StackedInline):
    model      = Student
    extra      = 0
    fields     = ['reg_number', 'student_class']
    can_delete = False


class TeacherInline(admin.StackedInline):
    model      = Teacher
    extra      = 0
    fields     = ['staff_id']
    can_delete = False


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display   = ['reg_number', 'get_full_name', 'student_class', 'created_at']
    list_filter    = ['student_class']
    search_fields  = ['reg_number', 'user__first_name', 'user__last_name', 'user__email']
    ordering       = ['reg_number']
    readonly_fields = ['created_at']

    @admin.display(description='Full Name')
    def get_full_name(self, obj):
        return obj.user.full_name


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display   = ['staff_id', 'get_full_name', 'get_email', 'created_at']
    search_fields  = ['staff_id', 'user__first_name', 'user__last_name', 'user__email']
    ordering       = ['staff_id']
    readonly_fields = ['created_at']

    @admin.display(description='Full Name')
    def get_full_name(self, obj):
        return obj.user.full_name

    @admin.display(description='Email')
    def get_email(self, obj):
        return obj.user.email
