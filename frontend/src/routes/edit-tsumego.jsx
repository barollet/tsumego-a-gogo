import { useRef, useState } from 'react';
import { useParams } from "react-router-dom";

import axios_client from "../axios";

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import NavBar from "../components/nav_bar";
import Switch from '../components/small_components/switch';
import { PlayTsumego } from "../components/tsumego_view";



export default function TsumegoEdit() {
    const {tsumegoId} = useParams();
    const [ validated, setValidated ] = useState(false);

    let variation = useRef([]); 

    // Click callback to add the next move to the variation
    function click_callback(coord) {
        variation.current.push(coord);
    }

    function handleUpdateVariation() {
        axios_client.post(`core/variation/`, {
            tsumego: tsumegoId,
            variation: variation.current,
            validated,
        }).then((response) => {
            console.log(response);
        });
    }

    function handleDeleteVariation() {
        console.log("delete");
        console.log(variation);
    }

    function handleBack() {
        variation.current.pop();
    }


    return (<>
        <NavBar/>
        <h1>Coucou lo {tsumegoId}</h1>
        <Row>
            <Col xs="auto">
                <Switch label="Set solution as validated directly" setChange={setValidated} init={false} />
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

        <PlayTsumego tsumego={tsumegoId} display_coords={true} click_callback={click_callback} back_callback={handleBack}/>
    </>)
}