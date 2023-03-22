const JGO = window.JGO;

// Sets default value to config so all values are sets
function set_config_defaults(config) {
    config.viewport = config.viewport || [19, 19];
    config.display_coords = config.display_coords || false;
}

// The name does not refer to a React state it is a jgoboard internal state
function createState(jsetup, jrecord) {
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
        lastY: -1
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

export function create_play_board(divref, sgf, config) {
    const [jsetup, jrecord] = static_board_from_sgf(sgf, config);

    var state = createState(jsetup, jrecord);

    // Board creation
    jsetup.create(divref, function (canvas) {

        // Puts transparent stone under the mouse
        canvas.addListener('mousemove', function(coord, ev) {
            if(coord.i == -1 || coord.j == -1 || (coord.i == state.lastX && coord.j == state.lastY))
              return;
        
            if(state.lastHover) // clear previous hover if there was one
            state.jboard.setType(new JGO.Coordinate(state.lastX, state.lastY), JGO.CLEAR);
        
            state.lastX = coord.i;
            state.lastY = coord.j;
        
            if(state.jboard.getType(coord) == JGO.CLEAR && state.jboard.getMark(coord) == JGO.MARK.NONE) {
                state.jboard.setType(coord, state.player == JGO.WHITE ? JGO.DIM_WHITE : JGO.DIM_BLACK);
                state.lastHover = true;
            } else
            state.lastHover = false;
        });

        // Remove mark for last position when leaving the canvas
        canvas.addListener('mouseout', function(ev) {
            if(state.lastHover)
                state.setType(new JGO.Coordinate(state.lastX, state.lastY), JGO.CLEAR);
        
                state.lastHover = false;
        });
    });
}


function coucou() {
var player = JGO.WHITE; // next player










var jrecord = new JGO.Record(13);
var jboard = jrecord.jboard;
var jsetup = new JGO.Setup(jboard, JGO.BOARD.largeWalnut);
var ko = false, lastMove = false; // ko coordinate and last move coordinate
var lastHover = false, lastX = -1, lastY = -1; // hover helper vars

jboard.setType(JGO.util.getHandicapCoordinates(jboard.width, 2), JGO.BLACK);

jsetup.setOptions({stars: {points:5}});
jsetup.create('board', function(canvas) {
  canvas.addListener('click', function(coord, ev) {
    var opponent = (player == JGO.BLACK) ? JGO.WHITE : JGO.BLACK;

    if(ev.shiftKey) { // on shift do edit
      if(jboard.getMark(coord) == JGO.MARK.NONE)
        jboard.setMark(coord, JGO.MARK.SELECTED);
      else
        jboard.setMark(coord, JGO.MARK.NONE);

      return;
    }

    // clear hover away - it'll be replaced or then it will be an illegal move
    // in any case so no need to worry about putting it back afterwards
    if(lastHover)
      jboard.setType(new JGO.Coordinate(lastX, lastY), JGO.CLEAR);

    lastHover = false;

    var play = jboard.playMove(coord, player, ko);

    if(play.success) {
      node = jrecord.createNode(true);
      node.info.captures[player] += play.captures.length; // tally captures
      node.setType(coord, player); // play stone
      node.setType(play.captures, JGO.CLEAR); // clear opponent's stones

      if(lastMove)
        node.setMark(lastMove, JGO.MARK.NONE); // clear previous mark
      if(ko)
        node.setMark(ko, JGO.MARK.NONE); // clear previous ko mark

      node.setMark(coord, JGO.MARK.CIRCLE); // mark move
      lastMove = coord;

      if(play.ko)
        node.setMark(play.ko, JGO.MARK.CIRCLE); // mark ko, too
      ko = play.ko;

      player = opponent;
      updateCaptures(node);
    } else alert('Illegal move: ' + play.errorMsg);
  });

  canvas.addListener('mousemove', function(coord, ev) {
    if(coord.i == -1 || coord.j == -1 || (coord.i == lastX && coord.j == lastY))
      return;

    if(lastHover) // clear previous hover if there was one
      jboard.setType(new JGO.Coordinate(lastX, lastY), JGO.CLEAR);

    lastX = coord.i;
    lastY = coord.j;

    if(jboard.getType(coord) == JGO.CLEAR && jboard.getMark(coord) == JGO.MARK.NONE) {
      jboard.setType(coord, player == JGO.WHITE ? JGO.DIM_WHITE : JGO.DIM_BLACK);
      lastHover = true;
    } else
      lastHover = false;
  });

  canvas.addListener('mouseout', function(ev) {
    if(lastHover)
      jboard.setType(new JGO.Coordinate(lastX, lastY), JGO.CLEAR);

    lastHover = false;
  });
});
}