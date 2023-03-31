"""
Small script to extract SGF files from common pdf
Tsumegos must look like this:
<((!((((((((((((((>
!!!!@@++++++++++++]
[@@@++++++++++++++]
[++*+++++*+++++*++]
[@++++++++++++++++]
[+++++++++++++++++]
problem 1

if nothing is said for the color in the line containing "problem" then it is assumed black to play.
"""
import os
import argparse
import string
import re

from pypdf import PdfReader
from sgfmill import sgf

BASE_OUTPUT_DIR = 'out'
FILENAME_RE = re.compile(r'problem ([\d|-]+).*')

def main():
    # parser for the filename
    parser = argparse.ArgumentParser(
        prog='Pdf2Sgf',
        description='Extracts SGF files from common pdf'
    )
    parser.add_argument('filename')
    args = parser.parse_args()

    # create output directory
    output_dir = os.path.join(BASE_OUTPUT_DIR, os.path.basename(args.filename).split('.')[0])
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # open the pdf and goes through the tsumego
    reader = PdfReader(args.filename)

    for i, (tsumego, text) in enumerate(text_tsumego_generator(reader)):
        create_sgf_file(tsumego, text, output_dir)

    print(f"Done {i+1} tsumegos")

def create_sgf_file(tsumego, text, output_dir):
    """Creates the sgf file corresponding to the given tsumego"""
    # if white is in the text we swap colors because we want black to play
    sgf_string = tsumego_to_sfg(tsumego, "white" in text)

    # extracts a filename, it is the string between the word "problem" and a ',' or a newline
    filename = FILENAME_RE.findall(text)
    if not filename:
        raise ValueError(f"Cannot find filename for text {text}")
    filename = filename[0] + ".sgf"

    # writes the file
    with open(os.path.join(output_dir, filename), "w", encoding="utf-8") as out_file:
        print(sgf_string, file=out_file)

def tsumego_to_sfg(tsumego: str, swap_color: bool = False) -> str:
    """Converts the given tsumego to an sgf string.
    Top left is (18,0), bottom right is (0, 18), it is (y, x)"""
    black_stones = []
    white_stones = []

    # extract the stones from tsumego
    # opposite means that the coordinate is the difference with the size of the board
    for opposite_y, line in enumerate(tsumego.splitlines()):
        for x, c in enumerate(line):
            pos = (18-opposite_y, x)
            if c == '!':
                white_stones.append(pos)
            elif c == '@':
                black_stones.append(pos)

    if swap_color:
        black_stones, white_stones = white_stones, black_stones

    # build sgf string (always build 19x19)
    sgf_game = sgf.Sgf_game(size=19)
    sgf_game.get_root().set_setup_stones(black_stones, white_stones)

    return sgf_game.serialise().decode()

def text_tsumego_generator(reader: PdfReader):
    """From a pdf reader, yields all the tsumegos with the alongside text."""
    # parser state if parsing a tsumego or not
    parser_is_in_tsumego = False
    # accumulators for tsumego and text
    tsumego = ""
    problem_text = ""

    for page in reader.pages:
        text = page.extract_text()
        if is_tsumego_page(text):
            # sperate tsumegos one by one along the lines
            for current_line in line_iterator(text):
                if is_tsumego_line(current_line):
                    # if we enter a tsumego and a tsumego is buffered, we yield it
                    if not parser_is_in_tsumego and tsumego:
                        yield tsumego, problem_text
                        # clears the buffers
                        tsumego = ""
                        problem_text = ""
                    # add the line to the current buffer
                    tsumego += current_line  + '\n' # we use newline to facilitate parsing later
                    parser_is_in_tsumego = True
                else:
                    problem_text += current_line + '\n' # same use for parsing
                    parser_is_in_tsumego = False


            # clear the buffers at the end of a page and sends the last tsumego
            if tsumego:
                yield tsumego, problem_text
            tsumego = ""
            problem_text = ""


RE_EXTRACT_TSUMEGO_LINE = re.compile(r'([\<\>\!\[\]).*,+(@A-Z]*)(.*)')

def line_iterator(text: str):
    """Iterator over lines of text.
    This is needed because some lines don't contain a line return \n"""
    for line in text.splitlines():
        # the buggy lines can only be first line of tsumego so they contain only <>!@(
        # we match the string in reverse order so ( cannot be taken for a regular ( in the text.
        groups = RE_EXTRACT_TSUMEGO_LINE.findall(line[::-1])[0]
        if groups[0] and groups[1]:
            # as the string is matched in reverse order group 1 has to be returned first
            # the groups has to be re-reversed
            yield groups[1][::-1]
            yield groups[0][::-1]
        else:
            # everything is fine we yield the line as if nothing happened
            yield line

def is_tsumego_page(text):
    """Returns wether the given text contains tsumego.
    The test is made if some lines contain only symbols"""
    return any(is_tsumego_line(line) for line in text.splitlines())

def is_tsumego_line(line):
    """Returns wether the given line is a tsumego line, it contains only characters"""
    # we compare only to lowercase as uppercase can be used as annotation in tsumego
    return all(c not in string.ascii_lowercase and c not in string.digits for c in line)


if __name__ == '__main__':
    main()
