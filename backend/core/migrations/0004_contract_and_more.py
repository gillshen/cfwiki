# Generated by Django 5.0.7 on 2024-07-20 10:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_remove_student_firstname_rm_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=100)),
                ('target_year', models.IntegerField()),
                ('date', models.DateField(blank=True, null=True)),
                ('status', models.CharField(choices=[('Effective', 'Effective'), ('Fulfilled', 'Fulfilled'), ('Terminated', 'Terminated')], max_length=50)),
                ('student_initial_progression', models.CharField(blank=True, max_length=50)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contracts', to='core.student')),
            ],
        ),
        migrations.AddConstraint(
            model_name='contract',
            constraint=models.UniqueConstraint(models.F('student'), models.F('type'), models.F('target_year'), name='contract_unique_student_type_targetyear'),
        ),
    ]
