# Generated by Django 5.0.7 on 2024-08-28 06:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0005_grade_is_weighted'),
    ]

    operations = [
        migrations.AddField(
            model_name='gmatscore',
            name='data_insights',
            field=models.SmallIntegerField(blank=True, null=True),
        ),
    ]
