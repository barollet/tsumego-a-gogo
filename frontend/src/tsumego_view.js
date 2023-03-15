import {React} from './config.js';
import {JGO} from './config.js';
import {axios_client} from './config.js';

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
function RawTsumego({sgf, viewport, display_coords=true}) {
    const containerRef = React.useRef(null);
    const init = React.useRef(false);

    React.useEffect(() => {
        if (init.current === false) {
            const jsetup = board_from_sgf(sgf, viewport);

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
    const [sgf, setSGF] = React.useState("");
    const [viewport, setViewport] = React.useState(null);

    React.useEffect(() => {
    axios_client.get(`tsumego/${id}`).then((response) => {
        setViewport([response.data.view_x, response.data.view_y]);
        setSGF(response.data.problem_sgf);
    });
    }, [id]);

    if (sgf == "" || viewport == null) {
        return (null);
    } else {
        return (
            <RawTsumego sgf={sgf} viewport={viewport} display_coords={display_coords} />
        );
    }

};