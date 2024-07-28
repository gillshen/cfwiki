# Generated by Django 5.0.7 on 2024-07-27 04:27

import django.db.models.deletion
import django.db.models.functions.text
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('target', '0003_remove_school_school_unique_abbreviation_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Program',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=50)),
                ('name', models.CharField(blank=True, max_length=100)),
                ('degree', models.CharField(blank=True, max_length=100)),
                ('schools', models.ManyToManyField(related_name='programs', to='target.school')),
            ],
        ),
        migrations.CreateModel(
            name='ProgramIteration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.IntegerField()),
                ('term', models.CharField(max_length=20)),
                ('user_rank', models.PositiveIntegerField(blank=True, null=True)),
                ('program', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='targets', to='target.program')),
            ],
        ),
        migrations.CreateModel(
            name='ApplicationRound',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('due_date', models.DateField(blank=True, null=True)),
                ('due_time', models.TimeField(blank=True, null=True)),
                ('timezone', models.CharField(blank=True, max_length=50)),
                ('decision_date', models.DateField(blank=True, null=True)),
                ('program_iteration', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='application_rounds', to='target.programiteration')),
            ],
        ),
        migrations.AddConstraint(
            model_name='programiteration',
            constraint=models.UniqueConstraint(models.F('program'), models.F('year'), django.db.models.functions.text.Lower('term'), name='programiteration_unique_program_year_term'),
        ),
        migrations.AddConstraint(
            model_name='applicationround',
            constraint=models.UniqueConstraint(models.F('program_iteration'), django.db.models.functions.text.Lower('name'), name='applicationround_unique_programiteration_name'),
        ),
    ]
