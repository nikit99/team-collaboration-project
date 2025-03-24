# Generated by Django 5.1.7 on 2025-03-24 15:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('auth_app', '0002_user_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(blank=True, related_name='auth_app_users', to='auth.group'),
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('superadmin', 'Superadmin'), ('admin', 'Admin'), ('user', 'User')], default='user', max_length=10),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, related_name='auth_app_users', to='auth.permission'),
        ),
    ]
