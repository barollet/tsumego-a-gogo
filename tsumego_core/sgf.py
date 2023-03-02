"""A module that defines SGF features.
It uses the sgfmill SGF parser library as an internal representation.

Be careful only 19x19 SGF are supported when doing operations on SGF

Documentation:
https://mjw.woodcraft.me.uk/sgfmill/doc/1.1.1/index.html

TOP-LEFT corner coordinate in sgfmill is (1, 19)

TODO support solution files"""

from sgfmill import sgf

VALID_SGF_PROP = ['GM', 'FF', 'CA', 'AW', 'AB']

TOP_LEFT = (-1, 1)
TOP_RIGHT = (1, 1)
BOTTOM_LEFT = (-1, -1)
BOTTOM_RIGHT = (1, -1)

def clean_sgf(game_tree: sgf.Sgf_game):
    """Removes unecessary nodes so internal SGF to tsumegogogo have the same format"""
    root = game_tree.get_root()

    # starts by setting utf-8 encoding
    root.set("CA", "utf-8")

    # removes invalid properties
    for prop in root.properties():
        if prop not in VALID_SGF_PROP:
            root.unset(prop)

def compute_quadrant(game_tree: sgf.Sgf_game) -> bool:
    """ Computes the tsumego orientation.
    It computes the quadrant where most points are located"""
    root = game_tree.get_root()

    moves = root.get('AW') | root.get('AB')
    quad_x = 0
    quad_y = 0
    # computes the polarity of each coordinate
    for (m_x, m_y) in moves:
        quad_x += [-1, 1][m_x <= 11]
        quad_y += [-1, 1][m_y <= 11]

    # normalize
    quad_x /= abs(quad_x)
    quad_y /= abs(quad_y)

    return (int(quad_x), int(quad_y))

def rotate_top_left(game_tree: sgf.Sgf_game):
    """Rotates the sgf if it is not oriented top left.
    So every sgf is oriented top left"""

    quadrant = compute_quadrant(game_tree)
    if quadrant == TOP_RIGHT:
        rotate_clockwise(game_tree, 3)
    elif quadrant == BOTTOM_RIGHT:
        rotate_clockwise(game_tree, 2)
    elif quadrant == BOTTOM_LEFT:
        rotate_clockwise(game_tree, 1)

def rotate_clockwise(game_tree: sgf.Sgf_game, n_rot: int = 1):
    """Rotates the SGF clockwise.
    It can be used for orientation randomization or focusing top-left quadrant.
    The argument is a number of rotation and 1 by default"""

    root = game_tree.get_root()
    black, white, point = root.get_setup_stones()

    def rotate_set(stone_set: set[(int, int)]):
        """Rotates clockwise a single set of stones coordinates"""
        rotated_set = set()
        for stone in stone_set:
            # x = y
            # y = 20 - x or y = 19 - x + 1
            rotated_set.add((stone[1], 20 - stone[0]))
        return rotated_set

    black = rotate_set(black)
    white = rotate_set(white)
    point = rotate_set(point)

    root.set_setup_stones(black, white, point)

    # rotate again if needed
    if n_rot > 1:
        rotate_clockwise(game_tree, n_rot-1)

# small dev tests functions
if __name__ == "__main__":
    game = sgf.Sgf_game.from_string("(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]RU[AGA]SZ[19]KM[7.50]PW[Theo]PB[Baptiste]AW[ca][cc]AB[ba][bb][cb])")

    clean_sgf(game)

    print(compute_quadrant(game))

    rotate_clockwise(game)

    print(compute_quadrant(game))

    print(game.serialise())
