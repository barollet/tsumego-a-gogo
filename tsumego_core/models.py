"""Collection and tsumego core models for the whole application"""
from django.db import models

# Create your models here.
class Collection(models.Model):
    """Collection model class.
    This is just a list there is no link to tsumegos inside it"""
    name = models.CharField(max_length=50)
    # enabled sets if the collection is publicly visible
    enabled = models.BooleanField(default=False)

class Tags(models.Model):
    """Tags for tsumegos to sort them by theme instead of collection"""
    name = models.CharField(20)

class Tsumego(models.Model):
    """Tsumego model class.
    For administration purpose they should always be stored on top left corner and black to play"""
    problem_sgf = models.CharField(max_length=400)
    solutions_sgf = models.TextField()
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tags)

    # statistics for the problem
    # maybe better statistics later
    num_seen = models.IntegerField(default=0)
    num_success = models.IntegerField(default=0)
    num_failure = models.IntegerField(default=0)
