from django.db.models.signals import post_save
from django.dispatch import receiver
from research.models import ResearchAssignment
from courses.models import CourseMember
from meetings.models import MeetingMember
from tasks.models import TaskAssignment
from .models import Notification
from common.models import ActivityLog


@receiver(post_save, sender=ResearchAssignment)
def research_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            notification_type='research',
            title='New Research Assigned',
            message=f'You have been assigned research: {instance.research.title}'
        )
        ActivityLog.objects.create(
            user=instance.user,
            module_name='Research',
            action='Research Assigned',
            description=f'Assigned to research: {instance.research.title}'
        )


@receiver(post_save, sender=CourseMember)
def course_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            notification_type='course',
            title='New Course Assigned',
            message=f'You have been added to course: {instance.course.name}'
        )
        ActivityLog.objects.create(
            user=instance.user,
            module_name='Course',
            action='Course Assigned',
            description=f'Assigned to course: {instance.course.name}'
        )


@receiver(post_save, sender=MeetingMember)
def meeting_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            notification_type='meeting',
            title='New Meeting Assigned',
            message=f'You have been added to meeting: {instance.meeting.title}'
        )
        ActivityLog.objects.create(
            user=instance.user,
            module_name='Meeting',
            action='Meeting Assigned',
            description=f'Added to meeting: {instance.meeting.title}'
        )


@receiver(post_save, sender=TaskAssignment)
def task_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            notification_type='general',
            title='New Task Assigned',
            message=f'You have been assigned task: {instance.task.title}'
        )
        ActivityLog.objects.create(
            user=instance.user,
            module_name='Task',
            action='Task Assigned',
            description=f'Assigned task: {instance.task.title}'
        )