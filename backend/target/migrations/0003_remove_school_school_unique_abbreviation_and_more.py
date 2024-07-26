# Generated by Django 5.0.7 on 2024-07-26 16:02

import django.db.models.functions.text
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('target', '0002_school_school_unique_name_and_more'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='school',
            name='school_unique_abbreviation',
        ),
        migrations.RenameField(
            model_name='school',
            old_name='abbreviation',
            new_name='alt_name',
        ),
        migrations.AddConstraint(
            model_name='school',
            constraint=models.UniqueConstraint(django.db.models.functions.text.Lower('alt_name'), condition=models.Q(('alt_name', ''), _negated=True), name='school_unique_altname'),
        ),
    ]
