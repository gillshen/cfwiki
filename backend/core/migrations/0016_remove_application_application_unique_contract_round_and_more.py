# Generated by Django 5.0.7 on 2024-08-26 04:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_application_track'),
        ('target', '0006_alter_programiteration_program'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='application',
            name='application_unique_contract_round',
        ),
        migrations.AddField(
            model_name='application',
            name='double_application',
            field=models.BooleanField(default=False),
        ),
        migrations.AddConstraint(
            model_name='application',
            constraint=models.UniqueConstraint(models.F('contract'), models.F('round'), condition=models.Q(('double_application', False)), name='application_unique_contract_round'),
        ),
    ]
