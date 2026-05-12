from django.contrib import admin
from django.utils.html import format_html
from .models import ExamSession, StudentAnswer, Result


class StudentAnswerInline(admin.TabularInline):
    model           = StudentAnswer
    extra           = 0
    readonly_fields = ['question', 'selected_option', 'is_correct', 'marks_obtained']
    can_delete      = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(ExamSession)
class ExamSessionAdmin(admin.ModelAdmin):
    list_display    = ['get_student', 'exam', 'status', 'started_at', 'submitted_at']
    list_filter     = ['status', 'exam']
    search_fields   = ['student__reg_number', 'student__user__first_name', 'student__user__last_name']
    ordering        = ['-started_at']
    readonly_fields = ['started_at', 'submitted_at']
    inlines         = [StudentAnswerInline]

    def has_add_permission(self, request):
        return False

    @admin.display(description='Student')
    def get_student(self, obj):
        return f"{obj.student.user.full_name} ({obj.student.reg_number})"


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display    = ['get_student', 'exam', 'total_score', 'total_marks', 'get_percentage', 'created_at']
    list_filter     = ['exam', 'exam__exam_class']
    search_fields   = ['student__reg_number', 'student__user__first_name', 'student__user__last_name']
    ordering        = ['-created_at']
    readonly_fields = ['session', 'student', 'exam', 'total_score', 'total_marks', 'created_at']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    @admin.display(description='Student')
    def get_student(self, obj):
        return f"{obj.student.user.full_name} ({obj.student.reg_number})"

    @admin.display(description='Score %')
    def get_percentage(self, obj):
        pct = obj.percentage
        if pct >= 70:
            color = 'green'
        elif pct >= 50:
            color = 'orange'
        else:
            color = 'red'
        return format_html('<b style="color:{}">{:.1f}%</b>', color, pct)
