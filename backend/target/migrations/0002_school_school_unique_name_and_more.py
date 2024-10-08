# Generated by Django 5.0.7 on 2024-07-26 12:26

import django.db.models.functions.text
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('target', '0001_initial'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='school',
            constraint=models.UniqueConstraint(django.db.models.functions.text.Lower('name'), name='school_unique_name'),
        ),
        migrations.AddConstraint(
            model_name='school',
            constraint=models.UniqueConstraint(django.db.models.functions.text.Lower('abbreviation'), condition=models.Q(('abbreviation', ''), _negated=True), name='school_unique_abbreviation'),
        ),
    ]
