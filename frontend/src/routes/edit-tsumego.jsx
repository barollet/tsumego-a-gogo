import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import { sendRequest } from "../axios";

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import NavBar from "../components/nav_bar";
import Switch from '../components/small_components/switch';
import { VariationTsumego } from "../components/tsumego_view";

import useBoardState from '../hooks/use_board_state';

import { deleteCurrentVariation, updateCurrentVariation } from '../jgoboard_functions';

const initCorrect = true;
const initValidated = false;

export default function TsumegoEdit() {
    const { tsumegoId } = useParams();
    const [ validated, setValidated ] = useState(initValidated);
    const [ correct, setCorrect ] = useState(initCorrect);

    const [ variations, setVariations ] = useState(null);

    // We use a ref instead of a state because the board display is not managed by React
    const [ board_state, setBoardState ] = useBoardState();

    useEffect(() => {
        async function fetchVariations() {
            const { response, error } = await sendRequest({
                url: `core/variation/${tsumegoId}`,
            });
            if (response) {
                setVariations(response.data)
            } else {
                console.log(error.message);
            }
        }
        fetchVariations();
    }, []);

    async function handleUpdateVariation() {
        if (board_state.current_variation.length === 0) {
            alert("Variation is empty, nothing to update");
            return;
        }
        const { response, error } = await sendRequest({
            url: `core/variation/`,
            method: 'post',
            data: {
                tsumego: tsumegoId,
                variation: board_state.current_variation,
                validated,
                correct,
            }
        });
        if (response) {
            if (response.data.message) {
                updateCurrentVariation(board_state, correct, validated);
            }
        } else {
            console.log(error.message);
        }
    }

    async function handleDeleteVariation() {
        if (board_state.current_variation.length === 0) {
            alert("Variation is empty, nothing to delete");
            return;
        }
        // TODO if don't delete leaf node => confirm
        const { response, error } = await sendRequest({
            url: `core/variation/${tsumegoId}`,
            method: 'delete',
            data: {
                variation: board_state.current_variation,
                validated, // They are not used but this is a placeholder
                correct, // Same maybe change this in backend
            }
        });
        if (response) {
            if (response.data.message) {
                deleteCurrentVariation(board_state);
            }
        } else {
            console.log(error.message);
        }
    }

    return (<>
        <NavBar/>
        <h1>Tsumego {tsumegoId}</h1>
        <Row>
            <Col xs="auto">
                <Switch label="Set solution as validated directly" setChange={setValidated} init={initValidated} />
                <Switch label="Set solution as correct directly" setChange={setCorrect} init={initCorrect} />
            </Col>
            <Col xs="auto">
                <Button type="button" variant="secondary" onClick={handleUpdateVariation}>Update</Button>
            </Col>
            <Col xs="auto">
                <Button type="button" variant="danger" onClick={handleDeleteVariation}>Delete</Button>
            </Col>
            <Col xs="auto">
            </Col>
        </Row>

        <VariationTsumego
            tsumego={tsumegoId}
            display_coords={true}
            show_variations={true}
            variations={variations}

            board_state={board_state}
            setBoardState={setBoardState}
        />
    </>)
}