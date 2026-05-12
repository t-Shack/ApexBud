from django.contrib import admin
from .models import Class, Subject


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display   = ['name', 'level', 'get_student_count', 'created_at']
    list_filter    = ['level']
    search_fields  = ['name', 'level']
    ordering       = ['name']
    readonly_fields = ['created_at']

    @admin.display(description='Students')
    def get_student_count(self, obj):
        return obj.students.count()


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display   = ['name', 'subject_class', 'get_teacher_name', 'get_question_count']
    list_filter    = ['subject_class']
    search_fields  = ['name', 'teacher__user__first_name', 'teacher__user__last_name']
    ordering       = ['name']
    readonly_fields = ['created_at']

    @admin.display(description='Teacher')
    def get_teacher_name(self, obj):
        return obj.teacher.user.full_name if obj.teacher else '—'

    @admin.display(description='Questions')
    def get_question_count(self, obj):
        return obj.questions.count()
