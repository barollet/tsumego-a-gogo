"""Collection and tsumego core models for the whole application"""
#!pylint: disable=missing-class-docstring, too-few-public-methods
from django.db import models

from tsumego_core.sgf import compute_bounding_box, rotate_top_left_sgfstring, remove_variations

# Create your models here.
class Collection(models.Model):
    """Collection model class.
    This is just a list there is no link to tsumegos inside it"""
    name = models.CharField(max_length=50, unique=True)
    # enabled sets if the collection is publicly visible
    enabled = models.BooleanField(default=False)

    def __str__(self):
        return str(self.name)

    class Meta:
        ordering = ['id']

class Tag(models.Model):
    """Tags for tsumegos to sort them by theme instead of collection"""
    name = models.CharField(max_length=20)

    def __str__(self):
        return str(self.name)

    class Meta:
        ordering = ['id']

class Tsumego(models.Model):
    """Tsumego model class.
    For administration purpose they should always be stored on top left corner and black to play"""
    problem_sgf = models.CharField(max_length=400)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    number = models.IntegerField() # tsumegos in a collection are sorted by number
    tags = models.ManyToManyField(Tag, blank=True)

    # viewport is hardcoded and computed in the save method
    view_x = models.PositiveSmallIntegerField()
    view_y = models.PositiveSmallIntegerField()

    def save(self, *args, **kwargs):
        self.problem_sgf = remove_variations(self.problem_sgf)

        # sets the tsumego in top left orientation
        self.problem_sgf = rotate_top_left_sgfstring(self.problem_sgf)

        # compute the bounding box
        self.view_x, self.view_y = compute_bounding_box(self.problem_sgf)
        super().save(*args, **kwargs)  # Call the "real" save() method.

    class Meta:
        # no two same tsumegos can have the same number in the same collection
        unique_together = ('collection', 'number',)
        ordering = ['collection', 'number']


class TsumegoStatistics(models.Model):
    tsumego = models.ForeignKey(Tsumego, on_delete=models.CASCADE)
    # statistics for the problem
    # maybe better statistics later
    num_seen = models.IntegerField(default=0)
    num_success = models.IntegerField(default=0)
    num_failure = models.IntegerField(default=0)
