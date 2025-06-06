# Generated by Django 5.1.6 on 2025-05-13 17:31

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('alertfi', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True, validators=[django.core.validators.RegexValidator(message='Email must follow the pattern name@domain.tld.countrycode', regex='^[\\w\\.-]+@[\\w\\.-]+\\.\\w+\\.\\w+$')]),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]
