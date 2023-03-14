import {React} from './config.js';
import {JGO} from './config.js';
import {axios_client} from './config.js';


function board_from_sgf(sgf) {
    const jrecord = JGO.sgf.load(sgf, true);

    const jboard = jrecord.jboard;
    return new JGO.Setup(jboard, JGO.BOARD.largeWalnut);
}

function set_display_coords(jsetup, value) {
    jsetup.setOptions({coordinates: {top:value, bottom:value, left:value, right:value}});

}

function RawTsumego({sgf, display_coords=true}) {
    const boardRef = React.useRef(null);

    React.useEffect(() => {
        const jsetup = board_from_sgf(sgf);

        set_display_coords(jsetup, display_coords);

        jsetup.view(0, 0, 5, 5);

        jsetup.create(boardRef.current);
      }, []);

    return (
        <div ref={boardRef}></div>
    );
}

export function SimpleTsumego({id, display_coords=false}) {
    const [sgf, setSGF] = React.useState("");

    React.useEffect(() => {
    axios_client.get(`tsumego/${id}`).then((response) => {
        setSGF(response.data.problem_sgf);
    });
    }, [id]);

    if (sgf == "") {
        return (null);
    } else {
        return (
            <RawTsumego sgf={sgf} display_coords={display_coords} />
        );
    }

};