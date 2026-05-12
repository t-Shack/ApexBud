import uuid
from django.db import models


class Class(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name       = models.CharField(max_length=50, unique=True)  # e.g. SS1A, JSS2B
    level      = models.CharField(max_length=50)               # e.g. Senior Secondary
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table         = 'classes'
        verbose_name     = 'Class'
        verbose_name_plural = 'Classes'
        ordering         = ['name']

    def __str__(self):
        return self.name


class Subject(models.Model):
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name          = models.CharField(max_length=100)
    subject_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='subjects')
    teacher       = models.ForeignKey(
        'accounts.Teacher', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='subjects'
    )
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table       = 'subjects'
        unique_together = [['name', 'subject_class']]
        ordering        = ['name']

    def __str__(self):
        return f"{self.name} — {self.subject_class.name}"
