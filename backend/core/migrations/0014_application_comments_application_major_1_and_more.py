# Generated by Django 5.0.7 on 2024-08-16 07:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_application_application_unique_contract_round'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='comments',
            field=models.CharField(blank=True, max_length=1000),
        ),
        migrations.AddField(
            model_name='application',
            name='major_1',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='application',
            name='major_2',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='application',
            name='major_3',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
