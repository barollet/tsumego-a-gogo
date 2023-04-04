"""Logic to upload on or several tsumegos"""
import zipfile
import re

from rest_framework.response import Response

from tsumego_core.models import Tsumego
from tsumego_core.serializers import TsumegoSerializer

NUMBER_RE = re.compile(r'\d+')

def upload_action(request, collection_key):
    """upload one or more several tsumegos in the database depending on the file type"""
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
    print(tsumego)
    print(tsumego.errors)
    return "Couldn't create tsumego"

def create_tsumegos_from_archive(archive_file, collection_id: int, taken_numbers: [int]):
    """Extract and add tsumegos in the given zip archive"""
    with zipfile.ZipFile(archive_file) as archive:
        for name in sorted(archive.namelist(), key=extract_number):
            # we ignore directory names
            if name.endswith('/'):
                continue
            if not name.endswith(".sgf"):
                return f"Invalid file {name} in archive"

            with archive.open(name) as sgf_file:
                err = create_tsumego_from_file(sgf_file, collection_id, taken_numbers)
                if err is not None:
                    return err

        return None

def extract_number(name):
    """Extract the numbers in an sgf name if available"""
    numbers = re.findall(NUMBER_RE, name)
    return list(map(int, numbers))
