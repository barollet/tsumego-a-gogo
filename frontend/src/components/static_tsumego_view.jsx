import React from 'react';
import axios_client from "../axios";

const JGO = window.JGO;

/* Define board manipulation functions */
function board_from_sgf(sgf, viewport = [19, 19]) {
    const jrecord = JGO.sgf.load(sgf, true);

    const jboard = jrecord.jboard;
    var jsetup = new JGO.Setup(jboard, JGO.BOARD.largeWalnut);

    jsetup.view(0, 0, viewport[0], viewport[1]);
    return jsetup;
}

function set_display_coords(jsetup, value) {
    jsetup.setOptions({coordinates: {top:value, bottom:value, left:value, right:value}});
}

// A raw tsumego visualization with basic customization
export function RawTsumego({tsumego, display_coords=true}) {
    const containerRef = React.useRef(null);
    const init = React.useRef(false);

    React.useEffect(() => {
        if (init.current === false) {
            const jsetup = board_from_sgf(tsumego.problem_sgf, [tsumego.view_x, tsumego.view_y]);

            set_display_coords(jsetup, display_coords);
            jsetup.create(containerRef.current);
            init.current = true;
        }
        
      }, []);
    return (
        <div ref={containerRef}></div>
    );
}

export function SimpleTsumego({id, display_coords=false}) {
    const [tsumego, setTsumego] = React.useState(null);

    React.useEffect(() => {
    axios_client.get(`core/tsumego/${id}`).then((response) => {
        setTsumego(response.data.tsumego);
    });
    }, [id]);

    if (tsumego === null) {
        return (null);
    } else {
        return (
            <RawTsumego tsumego={tsumego} display_coords={display_coords} />
        );
    }
};