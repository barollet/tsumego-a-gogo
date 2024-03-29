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


def apply_tree_function(sgf_string: str, tree_function):
    """Applies the given function to the SGF string and returns the modified SGF string"""
    game_tree = sgf.Sgf_game.from_string(sgf_string)
    return tree_function(game_tree).serialise().decode("utf-8")

def clean_sgf_headers(sgf_string: str):
    """Applies the clean_sgf function directly to the sgf string."""
    return apply_tree_function(sgf_string, clean_sgf_headers_internal)

def rotate_top_left_sgfstring(sgf_string: str):
    """Applies the rotate_top_left function directly to the sgf string."""
    return apply_tree_function(sgf_string, rotate_top_left)

def remove_variations(sgf_string: str):
    """Removes the variations from the sgf file appart from the root node"""
    game_tree = sgf.Sgf_game.from_string(sgf_string)
    # TODO understand why side effect is needed and fix remove_variations
    game_tree.serialise()

    remove_variations_internal(game_tree)

    return game_tree.serialise().decode("utf-8")

## Internal functions

def compute_bounding_box(sgf_string: str, margin_x=1, margin_y=1):
    """Computes the viewport for the given sgf.
    Margin sets the margin around the viewport to consider"""
    root = sgf.Sgf_game.from_string(sgf_string).get_root()
    moves = root.get('AW') | root.get('AB')
    # sgfmill coordinates are 0, 0 bottom left (y, x)
    # jgoboard coordinates are 0, 0 top left (x, y)
    # We move the coordinates to jgoboard representation
    bb_x, bb_y = 0, 0
    for (m_y, m_x) in moves:
        bb_x = max(bb_x, m_x)
        bb_y = max(bb_y, 19 - (m_y + 1))

    # the bounding box is capped at 19, independantly of the margin
    return (min(bb_x + 1 + margin_x, 19), min(bb_y + 1 + margin_y, 19))

def clean_sgf_headers_internal(game_tree: sgf.Sgf_game):
    """Removes unecessary nodes so internal SGF to tsumegogogo have the same format"""
    root = game_tree.get_root()

    # starts by setting utf-8 encoding
    root.set("CA", "utf-8")

    # removes invalid properties
    for prop in root.properties():
        if prop not in VALID_SGF_PROP:
            root.unset(prop)

    return game_tree

def remove_variations_internal(game_tree: sgf.Sgf_game):
    """Removes any variation appart from the root node"""
    root = game_tree.get_root()
    # dirty operation, maybe use library API instead of internal value ?
    root._children.clear()

    return game_tree

def normalize(coord):
    """Used to compute tsumego quadrants"""
    direction = coord - 9
    if direction != 0:
        direction = direction / abs(direction)
    return direction

def compute_quadrant(game_tree: sgf.Sgf_game) -> bool:
    """ Computes the tsumego orientation.
    It computes the quadrant where most points are located"""
    root = game_tree.get_root()

    moves = root.get('AW') | root.get('AB')
    quad_x = 0
    quad_y = 0
    # computes the polarity of each coordinate
    for (m_y, m_x) in moves:
        quad_x += normalize(m_x)
        quad_y += normalize(m_y)

    # if the polarity is less than 60% of the moves are on the same quadrant, keep the original orientation
    if abs(quad_x) < 0.4*len(moves) or abs(quad_y) < 0.4*len(moves):
        return TOP_LEFT

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

    return game_tree

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
            # stones are (y, x)
            # x = y
            # y = 18 - x or y = 19 - (x + 1)
            rotated_set.add((18 - stone[1], stone[0]))
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

    clean_sgf_headers_internal(game)

    print(compute_quadrant(game))

    rotate_clockwise(game)

    print(compute_quadrant(game))

    print(game.serialise())

    game2 =  sgf.Sgf_game.from_string("(;FF[4]AB[cb][cc][bd][cd]AW[db][dc][dd][be][ce][ee]CA[utf-8]GM[1];B[hc](;W[hf];B[ie];W[jd])(;W[ij];B[kj];W[lh]))")
    print(game2.serialise())
    print(game2.get_root())
    remove_variations_internal(game2)
    print(game2.serialise())

    print("GAME3")
    GAME3S = "(;FF[4]AB[kb][lc][mc][nd][od][oe][pc][pe][pg][qe]\nAW[gc][ic][jc][je][le][nf][oc][of][pd][pf][qc][qd][re][rf]CA[UTF-8]GM[1])"
    game3 = sgf.Sgf_game.from_string(GAME3S)
    print(compute_quadrant(game3))
    rotated = rotate_top_left_sgfstring(GAME3S)
    print(compute_quadrant(sgf.Sgf_game.from_string(rotated)))
    print(compute_bounding_box(rotated))


