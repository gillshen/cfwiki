# Generated by Django 5.0.7 on 2024-07-21 03:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_contract_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contract',
            name='status',
            field=models.CharField(choices=[('In effect', 'In effect'), ('Fulfilled', 'Fulfilled'), ('Terminated', 'Terminated')], max_length=50),
        ),
    ]
