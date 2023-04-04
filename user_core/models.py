from django.db import models
from django.conf import settings

from tsumego_core.models import Collection, Tsumego

# Create your models here.
class ProgressEntry(models.Model):
    """This class holds progress entry for users"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    tsumego = models.ForeignKey(Tsumego, on_delete=models.CASCADE)

    success = models.BooleanField()
    time = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.collection = self.tsumego.collection
        super().save(*args, **kwargs)  # Call the "real" save() method.
