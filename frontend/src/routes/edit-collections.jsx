import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import axios_client from "../axios";


function EditCollectionName({name}) {
    return (<>
        <Col xs="auto">
            <Form.Label>Name:</Form.Label>
        </Col>
        <Col>
            <Form.Control className="me-auto" defaultValue={name} />
        </Col>
    </>)
}

function EditEnableCheckbox({enabled}) {
    return (
        <Col xs="auto">
        <Form.Check 
            type='checkbox'
            id='enabled'
            label='Enabled'
            defaultChecked={enabled}
        />
        </Col>
    )
}

function ButtonGroup({handleSee, handleDelete}) {
    return (<>
        <Col xs="auto">
            <Button type="button" variant="primary" onClick={handleSee}>See</Button>
        </Col>
        <Col xs="auto">
            <Button type="submit" variant="secondary">Update</Button>
        </Col>
        <Col xs="auto">
            <Button type="reset" variant="warning">Reset</Button>
        </Col>
        <Col xs="auto">
            <div className="vr" />
            <Button type="button" variant="outline-danger" onClick={handleDelete}>Delete</Button>
        </Col>
    </>)
}

function CollectionListItem({collection}) {
    const navigate = useNavigate();

    function handleSeeClick() {
        navigate(`/collection/${collection.id}/edit`);
    }

    function handleSubmit(data) {
        console.log(data);
    }

    function handleDeleteClick() {
        console.log("delete " + collection.id);
    }

    return (
        <ListGroup.Item>
            <Stack direction="horizontal" gap={3}>
                <div>{collection.id}</div>

                <Form onSubmit={handleSubmit}>
                <Row>
                    <EditCollectionName name={collection.name}/>

                    <EditEnableCheckbox enabled={collection.enabled} />

                    <ButtonGroup handleSee={handleSeeClick} handleDelete={handleDeleteClick} />
                </Row>
                </Form>
            </Stack>
       </ListGroup.Item>
    )
}

function CreateCollectionForm() {
    function handleSubmit(data) {
        console.log(data);
        alert(data.toString());
    }

    return (
        <Form onSubmit={handleSubmit}>
                <Row>
                    <EditCollectionName name="New Collection Name"/>

                    <EditEnableCheckbox enabled={true} />
                    <Col xs="auto">
                        <Button type="submit" variant="success">Create</Button>
                    </Col>
                </Row>
        </Form>
    )
}

export default function CollectionsEdit() {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        axios_client.get(`collection/`).then((response) => {
            setCollections(response.data);
        });
    }, []);

    return (
        <>
        <h3>Liste des collections:</h3>
        <ListGroup>
            {collections.map(collection => (
                <CollectionListItem key={collection.id} collection={collection}/>
            ))}
        </ListGroup>

        <h3>Créer une nouvelle collection:</h3>
        <CreateCollectionForm />
        </>
    )
}


/*
export function SimpleTsumego({id, display_coords=false}) {
    const [sgf, setSGF] = React.useState("");
    const [viewport, setViewport] = React.useState(null);

    useEffect(() => {
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
*/