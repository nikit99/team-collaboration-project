# Generated by Django 5.1.7 on 2025-03-19 07:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='name',
            field=models.CharField(default='Unknown', max_length=255),
        ),
    ]
