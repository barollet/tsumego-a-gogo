import React, { useState } from 'react';
import axios_client from "../axios";

import Button from 'react-bootstrap/Button';

import useTsumego from '../hooks/use_tsumego';

import { create_static_board, create_play_board } from '../jgoboard_functions';

// A raw tsumego visualization with basic customization
// If only an id is provided for tsumego, the tsumego is fetched from the database
// setBoardState is an external setter to return the board state after creation
function TsumegoView({tsumego_prop, static_board=false, variations=null, show_variation=false, display_coords=true, setBoardState=null}) {
    const containerRef = React.useRef(null);
    const init = React.useRef(false); // Ref to only initialize tsumego view once
    const board_ref = React.useRef(false); // Ref to only initialize tsumego view once

    const tsumego = useTsumego(tsumego_prop);

    // Variation is ready to be displayed (if needed to be displayed)
    const variation_ready = !show_variation || variations; 
    React.useEffect(() => {
        // If the view is initialized we do nothing
        if (init.current === false && tsumego !== null && variation_ready) {
            const config = {
                viewport: [tsumego.view_x, tsumego.view_y],
                display_coords,
                show_variation,
                variations,
            };
            // When we have the tsumego we do the rendering
            if (static_board) {
                if(tsumego.number == 182 || tsumego.number == 27) {
                    console.log(tsumego);
                    console.log("coucou")
                    return;
                }
                create_static_board(containerRef.current, tsumego.problem_sgf, config);
            } else {
                let board_state = create_play_board(containerRef.current, tsumego.problem_sgf, config);
                setBoardState(board_state);
                board_ref.current = board_state;
            }
            init.current = true;
        }
    }, [tsumego, variations]);
    
    if (tsumego !== null) {
        return (
            <div ref={containerRef}></div>
        );
    }
}

// Static tsumego uses raw tsumego without any canvas function
export function StaticTsumego({tsumego, display_coords=true}) {
    return <TsumegoView
        tsumego_prop={tsumego}
        display_coords={display_coords}
        static_board={true}
    />
}

export function VariationTsumego({tsumego, variations, board_state, setBoardState, display_coords=true}) {
    return (<>
    <TsumegoView
        tsumego_prop={tsumego}
        variations={variations}
        display_coords={display_coords}
        show_variation={true}
        setBoardState={setBoardState}
    />
    <Button type="button" variant="primary" onClick={() => board_state.back()}>Back</Button>
    </>)
}