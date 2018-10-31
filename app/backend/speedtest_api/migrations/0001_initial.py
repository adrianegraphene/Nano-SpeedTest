# Generated by Django 2.1.2 on 2018-10-31 00:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(max_length=64)),
                ('current_balance', models.IntegerField()),
                ('POW', models.CharField(max_length=16)),
            ],
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('IP', models.GenericIPAddressField()),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=8)),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=8)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_send_timestamp', models.DateTimeField()),
                ('end_send_timestamp', models.DateTimeField()),
                ('start_receive_timestamp', models.DateTimeField()),
                ('end_receive_timestamp', models.DateTimeField()),
                ('amount', models.IntegerField()),
                ('initiated_by', models.GenericIPAddressField()),
                ('transaction_hash_sending', models.CharField(max_length=64)),
                ('transaction_hash_receiving', models.CharField(max_length=64)),
                ('destination', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='destination', to='speedtest_api.Account')),
                ('origin', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='origin', to='speedtest_api.Account')),
            ],
        ),
        migrations.CreateModel(
            name='Wallet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('node', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='speedtest_api.Node')),
            ],
        ),
        migrations.AddField(
            model_name='account',
            name='wallet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='speedtest_api.Wallet'),
        ),
    ]
