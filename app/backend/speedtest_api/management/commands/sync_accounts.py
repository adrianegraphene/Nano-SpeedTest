import time

from django.core.management.base import BaseCommand, CommandError
import nano

from ...models import *
from ...services import *


class Command(BaseCommand):
    help = 'Sync account balances with the nano network'

    def handle(self, *args, **options):
        """
        Sync account balances with the nano network
        """

        accounts.sync_accounts()
