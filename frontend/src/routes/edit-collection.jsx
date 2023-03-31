import React from "react";
import { useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/esm/Button';

import NavBar from "../components/nav_bar";

import axios_client from "../axios";

import TsumegoUpload from "../components/upload_file";
import TsumegoEditCard from "../components/tsumego_edit_card";

const divStyle = {
    display: "flex",
    flexWrap: "wrap"
}

export default function CollectionEdit() {
    const { collectionId } = useParams();
    const [tsumegos, setTsumegos] = React.useState([]);

    React.useEffect(() => {
        axios_client.get(`core/tsumego/?filter{collection}=${collectionId}`).then((response) => {
            // TODO put back in normal order and not last inserted ?
            // Do button to toggle this
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

        <Button type="button" variant="primary" onClick={() => alert("TODO Not implemented yet")}>Reverse order</Button>

        <div style={divStyle}>
            {tsumegos.map((tsumego) => <TsumegoEditCard key={tsumego.id} tsumego={tsumego} display_coords={false}/>)}
        </div>

        </Container>
    );
}
