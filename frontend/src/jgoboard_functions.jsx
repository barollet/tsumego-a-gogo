const JGO = window.JGO;

// Sets default value to config so all values are sets
function set_config_defaults(config) {
    config.viewport = config.viewport || [19, 19];
    config.display_coords = config.display_coords || false;
    config.variations = config.variations || {children: []};
    config.show_variation = config.show_variation || false;
}

// The name does not refer to a React state it is a jgoboard internal state
function createState(jsetup, jrecord, config) {
    const event_target = new EventTarget();
    return {
        player: JGO.BLACK, // next player
        jrecord,
        jsetup,
        jboard: jrecord.jboard,
        // ko coordinate and last move coordinate
        ko: false,
        lastMove: false,
        // hover helper vars
        lastHover: false,
        lastX: -1,
        lastY: -1,

        current_variation: [],
        variations: config.variations,
        show_variation: config.show_variation,
        last_variations_marks: [],

        // Wrapper to trigger the back listener
        event_target,
        back: () => event_target.dispatchEvent(new Event('back')),
    }
}

/* Define board manipulation functions */
function static_board_from_sgf(sgf, config) {
    set_config_defaults(config);

    const jrecord = JGO.sgf.load(sgf, true);

    const jboard = jrecord.jboard;
    var jsetup = new JGO.Setup(jboard, JGO.BOARD.largeWalnut);

    // Display coordinates or not
    const display_coords = config.display_coords;
    jsetup.setOptions({coordinates: {top:display_coords, bottom:display_coords, left:display_coords, right:display_coords}});

    jsetup.view(0, 0, config.viewport[0], config.viewport[1]);
    return [jsetup, jrecord];
}

export function create_static_board(divref, sgf, config) {
    const [jsetup, jrecord] = static_board_from_sgf(sgf, config)
    jsetup.create(divref);
}

// Creates a board with a canvas function
// mouse move and mouse hover are default values and mouse click need to be provided
export function create_play_board(divref, sgf, config) {
    const [jsetup, jrecord] = static_board_from_sgf(sgf, config);

    var state = createState(jsetup, jrecord, config);

    // Board creation
    jsetup.create(divref, function (canvas) {
        // TODO PLAY
        canvas.addListener('click', function(coord, ev) {
            // Check bounding box for click
            if (coord.i < 0 || coord.j < 0 || coord.i >= jsetup.options.view.width || coord.j >= jsetup.options.view.height) {
                return;
            }
            placeClickedStone(coord, ev, state);
        });

        // Puts transparent stone under the mouse
        canvas.addListener('mousemove', function(coord, ev) {
            addStoneHint(coord, state);
        });

        // Remove mark for last position when leaving the canvas
        canvas.addListener('mouseout', function(ev) {
            clearStoneHint(state);
        });
    });

    // Manually add event handler for back in variation
    state.event_target.addEventListener('back', function(ev) {
        state.current_variation.pop();
        
        state.jrecord.previous();
        switchPlayer(state);

        updateVariationsMarks(state);
    });

    // Sets the initial variation marks
    updateVariationsMarks(state);

    return state;
}

// Computes the current position in the variation tree from the variation
function findVariationNode(state) {
    var current_node = state.variations.children;
    for(const node of state.current_variation) {
        const next_node = current_node.find(e => e.move === node.toString());
        if (next_node) {
            current_node = next_node.children;
        } else {
            // If we are out of the variation we don't return anything
            return [];
        }
    }
    return current_node;
}

function updateVariationsMarks(state) { 
    clearVariationsMarks(state);
    if (state.show_variation) {
        const node_children = findVariationNode(state);
        for(const move of node_children) {
            var mark_type;
            if (move.correct) {
                if (move.validated) {
                    mark_type = JGO.MARK.CORRECT;
                } else {
                    mark_type = JGO.MARK.CORRECT_WAITING;
                }
            } else if (move.validated) {
                mark_type = JGO.MARK.INCORRECT;
            } else {
                mark_type = JGO.MARK.INCORRECT_WAITING;
            }

            state.jboard.setMark(new JGO.Coordinate(move.move), mark_type);
            state.last_variations_marks.push(move.move);
        }
    }
}

function clearVariationsMarks(state) {
    for(const move of state.last_variations_marks) {
        state.jboard.setMark(new JGO.Coordinate(move), JGO.MARK.NONE);
    }
    // Clear the mark array after the marks are removed
    state.last_variations_marks.lenght = 0;
}

function addStoneHint(coord, state) {
    if(coord.i == -1 || coord.j == -1 || (coord.i == state.lastX && coord.j == state.lastY))
        return;
        
    if(state.lastHover) // clear previous hover if there was one
        state.jboard.setType(new JGO.Coordinate(state.lastX, state.lastY), JGO.CLEAR);
        
    state.lastX = coord.i;
    state.lastY = coord.j;

    if(state.jboard.getType(coord) == JGO.CLEAR && state.jboard.getMark(coord) == JGO.MARK.NONE) {
        state.jboard.setType(coord, state.player == JGO.WHITE ? JGO.DIM_WHITE : JGO.DIM_BLACK);
        state.lastHover = true;
    } else {
        state.lastHover = false;
    }
}

function clearStoneHint(state) {
    if(state.lastHover) {
        state.jboard.setType(new JGO.Coordinate(state.lastX, state.lastY), JGO.CLEAR);
    }

    state.lastHover = false;
}

function switchPlayer(state) {
    const opponent = (state.player == JGO.BLACK) ? JGO.WHITE : JGO.BLACK;
    state.player = opponent;
}

function placeClickedStone(coord, ev, state) {
    var jboard = state.jboard;

    if(ev.shiftKey) { // on shift do edit
        if(jboard.getMark(coord) == JGO.MARK.NONE) {
            jboard.setMark(coord, JGO.MARK.SELECTED);
        } else {
            jboard.setMark(coord, JGO.MARK.NONE);
        }
        return;
    }

    // clear hover away - it'll be replaced or then it will be an illegal move
    // in any case so no need to worry about putting it back afterwards
    if(state.lastHover) {
        jboard.setType(new JGO.Coordinate(state.lastX, state.lastY), JGO.CLEAR);
    }

    state.lastHover = false;

    var play = jboard.playMove(coord, state.player, state.ko);

    if(play.success) {
        node = state.jrecord.createNode(true);
        node.setType(coord, state.player); // play stone
        node.setType(play.captures, JGO.CLEAR); // clear opponent's stones

        if(state.lastMove) {
            node.setMark(state.lastMove, JGO.MARK.NONE); // clear previous mark
        }
        if(state.ko) {
            node.setMark(state.ko, JGO.MARK.NONE); // clear previous ko mark
        }

        node.setMark(coord, JGO.MARK.CIRCLE); // mark move

        state.lastMove = coord;

        if(play.ko) {
            node.setMark(play.ko, JGO.MARK.CIRCLE); // mark ko, too
        }
        state.ko = play.ko;

        switchPlayer(state);
        state.current_variation.push(coord);

        updateVariationsMarks(state);
    } else {
        alert('Illegal move: ' + play.errorMsg);
    }
}