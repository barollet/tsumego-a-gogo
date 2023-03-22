import React from 'react';
import axios_client from "../axios";

import { create_static_board, create_play_board } from '../jgoboard_functions';

// A raw tsumego visualization with basic customization
// If only an id is provided for tsumego, the tsumego is fetched from the database
function RawTsumego({tsumego_prop, display_coords=true, canvas_function=null}) {
    const containerRef = React.useRef(null);
    const init = React.useRef(false); // Ref to only initialize tsumego view once

    // If the tsumego is a full object we use it otherwise we set it to null so it will be fetched
    // TODO change this ?
    const init_tsumego_state = typeof(tsumego_prop) == "object" ? tsumego_prop : null;
    const [tsumego, setTsumego] = React.useState(init_tsumego_state);

    React.useEffect(() => {
        // If the view is initialized we do nothing
        if (init.current === false) {
            // If the tsumego is not set we fetch it from the database
            if (tsumego === null) {
                const id = tsumego_prop;
                axios_client.get(`core/tsumego/${id}`).then((response) => {
                    setTsumego(response.data.tsumego);
                });
            } else {
                const config = {
                    viewport: [tsumego.view_x, tsumego.view_y],
                    display_coords: display_coords,
                };

                // When we have the tsumego we do the rendering
                if (canvas_function === null) {
                    create_static_board(containerRef.current, tsumego.problem_sgf, config);
                } else {
                    create_play_board(containerRef.current, tsumego.problem_sgf, config);
                }
                init.current = true;
            }
        }    
    }, [tsumego]);
    
    if (tsumego === null) {
        return (null);
    } else {
        return (
            <div ref={containerRef}></div>
        );
    }
}

// Static tsumego uses raw tsumego without any canvas function
export function StaticTsumego({tsumego, display_coords=true}) {
    return <RawTsumego tsumego_prop={tsumego} display_coords={display_coords}/>
}