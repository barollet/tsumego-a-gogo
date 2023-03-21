//import {SimpleTsumego} from './tsumego_view.js';
import React from "react";
import { useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container';

import NavBar from "../components/nav_bar";

import axios_client from "../axios";

import { RawTsumego } from "../components/static_tsumego_view";
import TsumegoUpload from "../components/upload_file";

const divStyle = {
    display: "flex",
    flexWrap: "wrap"
}

export default function CollectionEdit() {
    const { collectionId } = useParams();
    const [tsumegos, setTsumegos] = React.useState([]);

    React.useEffect(() => {
        axios_client.get(`core/tsumego/?filter{collection}=${collectionId}`).then((response) => {
            setTsumegos(response.data.tsumegos);
        });
    }, []);

    return (
        <Container fluid>
        <NavBar />
        <h1>Amazing collection</h1>

        <h1>Add a Tsumego</h1>
        <TsumegoUpload collectionId={collectionId}/>

        <p>Collection {collectionId}</p>

        <div style={divStyle}>
            {tsumegos.map((tsumego) => <RawTsumego key={tsumego.id} tsumego={tsumego} display_coords={false}/>)}
        </div>

        </Container>
    );
}
