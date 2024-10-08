# Generated by Django 5.0.7 on 2024-07-27 05:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_rename_student_initial_progression_contract_student_progression_when_signed'),
        ('target', '0004_program_programiteration_applicationround_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('round', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='target.applicationround')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='core.student')),
            ],
        ),
        migrations.AddConstraint(
            model_name='application',
            constraint=models.UniqueConstraint(models.F('student'), models.F('round'), name='application_unique_student_round'),
        ),
    ]
