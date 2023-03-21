"""This module defines the basic views for:
adding, modifying and getting a list of collection, tsumego and list

The ListCreate API View returns a list with GET and creates an element with POST.
The Detail API View is used for updating a single element.

Reference documentation: https://www.django-rest-framework.org/api-guide/generic-views/
"""
import zipfile

#pylint: disable=C0115
from rest_framework import viewsets
from dynamic_rest.viewsets import DynamicModelViewSet

from rest_framework.decorators import action
from rest_framework.response import Response

from django.db.models import Count

from tsumego_core.models import Collection, Tag, Tsumego
from tsumego_core.serializers import CollectionSerializer, TagSerializer, TsumegoSerializer

def next_available_number_update(taken_numbers):
    """gets the next available number from the given list sets it as taken"""
    if not taken_numbers:
        taken_numbers.add(1)
        return 1

    available_holes = set(range(1, max(taken_numbers))) - taken_numbers
    # if some numbers are not taken in-between
    if available_holes:
        next_number = min(available_holes)
    else:
        # else we choose the next number in the list
        next_number = max(taken_numbers) + 1

    taken_numbers.add(next_number)
    return next_number

def create_tsumego_from_file(sgf_file, collection_id: int, taken_numbers: [int]):
    """Creates the given tsumego in the database, returns the error message or None if succeeded"""
    sgf_string = sgf_file.read().decode("utf-8")

    number = next_available_number_update(taken_numbers)
    tsumego = TsumegoSerializer(data={
        "problem_sgf": sgf_string,
        "collection": collection_id,
        "number": number}
    )
    if tsumego.is_valid():
        tsumego.save()
        return None # no error, everything when fine
    return "Couldn't create tsumego"

def create_tsumegos_from_archive(archive_file, collection_id: int, taken_numbers: [int]):
    """Extract and add tsumegos in the given zip archive"""
    with zipfile.ZipFile(archive_file) as archive:
        for name in archive.namelist():
            if not name.endswith(".sgf"):
                return f"Invalid file {name} in archive"

            with archive.open(name) as sgf_file:
                err = create_tsumego_from_file(sgf_file, collection_id, taken_numbers)
                if err is not None:
                    return err
       
        return None


class CollectionViewSet(viewsets.ModelViewSet):
    # we add the number of tsumego in each collection
    queryset = Collection.objects.all().annotate(number=Count('tsumego')).order_by('id')
    serializer_class = CollectionSerializer

    @action(detail=True, methods=['post'])
    def upload(self, request, pk=None):
        """Upload one or several tsumegos to be added to a collection"""
        collection_key = pk
        files = request.FILES

        # computes the numbers already taken in the collection
        taken_numbers = set(Tsumego.objects
            .filter(collection__exact=collection_key)
            .values_list('number', flat=True))

        if "zip" in files:
            # handle zip file
            err = create_tsumegos_from_archive(files["zip"], collection_key, taken_numbers)
        elif "sgf" in files:
            # handle single sgf file
            err = create_tsumego_from_file(files["sgf"], collection_key, taken_numbers)
        else:
            err = "invalid file provided"

        if err is not None:
            return Response({"error": f"An error occured during insertion: {err}"})
        return Response({"message": f"Successfully inserted tsumegos in collection {collection_key}"})


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

# Maybe Tsumego will have a different behavior at some point
# TODO get list by collections
class TsumegoViewSet(DynamicModelViewSet):
    queryset = Tsumego.objects.all()
    serializer_class = TsumegoSerializer
