from django.contrib import admin
from django.utils.html import format_html
from .models import Question, Option, Exam, ExamQuestion


class OptionInline(admin.TabularInline):
    model   = Option
    extra   = 4
    fields  = ['option_text', 'is_correct']
    min_num = 2

    def get_extra(self, request, obj=None, **kwargs):
        # No extra blank rows when editing an existing question
        return 0 if obj else 4


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display   = ['short_text', 'subject', 'question_type', 'get_correct_option', 'created_by', 'created_at']
    list_filter    = ['question_type', 'subject__subject_class', 'subject']
    search_fields  = ['question_text']
    ordering       = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    inlines        = [OptionInline]

    fieldsets = (
        (None, {
            'fields': ('subject', 'question_type', 'question_text', 'created_by')
        }),
        ('Timestamps', {
            'classes': ('collapse',),
            'fields': ('created_at', 'updated_at'),
        }),
    )

    @admin.display(description='Question')
    def short_text(self, obj):
        return obj.question_text[:70] + '…' if len(obj.question_text) > 70 else obj.question_text

    @admin.display(description='Correct Answer')
    def get_correct_option(self, obj):
        correct = obj.options.filter(is_correct=True).first()
        return correct.option_text if correct else format_html('<span style="color:red">⚠ None set</span>')


class ExamQuestionInline(admin.TabularInline):
    model          = ExamQuestion
    extra          = 0
    fields         = ['question', 'order', 'marks']
    ordering       = ['order']
    autocomplete_fields = ['question']


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display   = ['title', 'subject', 'exam_class', 'status', 'get_total_marks', 'get_question_count', 'start_time', 'end_time']
    list_filter    = ['status', 'exam_class', 'subject']
    search_fields  = ['title']
    ordering       = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    inlines        = [ExamQuestionInline]

    fieldsets = (
        ('Exam Info', {
            'fields': ('title', 'subject', 'exam_class', 'created_by', 'status')
        }),
        ('Schedule', {
            'fields': ('duration_minutes', 'start_time', 'end_time')
        }),
        ('Timestamps', {
            'classes': ('collapse',),
            'fields': ('created_at', 'updated_at'),
        }),
    )

    @admin.display(description='Total Marks')
    def get_total_marks(self, obj):
        return obj.total_marks

    @admin.display(description='Questions')
    def get_question_count(self, obj):
        return obj.question_count

    actions = ['mark_active', 'mark_completed', 'mark_draft']

    @admin.action(description='Set selected exams → Active')
    def mark_active(self, request, queryset):
        queryset.update(status=Exam.Status.ACTIVE)

    @admin.action(description='Set selected exams → Completed')
    def mark_completed(self, request, queryset):
        queryset.update(status=Exam.Status.COMPLETED)

    @admin.action(description='Set selected exams → Draft')
    def mark_draft(self, request, queryset):
        queryset.update(status=Exam.Status.DRAFT)
