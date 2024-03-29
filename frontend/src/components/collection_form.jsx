import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ShowId({init, show}) {
    if (show) {
        return <>
        <Col xs="auto"><p>Id: {init.id}</p></Col>
        <Col xs="auto"><p>Number of problems: {init.number}</p></Col>
        </>
    }
}

/* Two small edition components
*/
function EditCollectionName({setter, init}) {
    return (<>
        <Col xs="auto">
            <Form.Label>Name:</Form.Label>
        </Col>
        <Col>
            <Form.Control
                defaultValue={init.name}
                onChange={(e) => {
                    setter("name", e.target.value);
                }}
            />
        </Col>
    </>)
}

function EditEnableCheckbox({setter, init}) {
    return (
        <Col xs="auto">
        <Form.Check 
            type='checkbox'
            id='enabled'
            label='Enabled'
            defaultChecked={init.enabled}
            onChange={(e) => {
                setter("enabled", e.target.checked);
            }}
        />
        </Col>
    )
}

/* Button group to trigger commands
This may be abstracted in the future with other editions
*/
function ButtonGroup({collection, handlers}) {
    const navigate = useNavigate();

    function handleSee() {
        console.log(collection);
        navigate(`/collection/edit/${collection.id.toString()}`);
    }

    if (handlers.create_f !== null) {
        return <Col xs="auto">
            <Button type="button" variant="success" onClick={() => handlers.create_f(collection)}>Create</Button>
        </Col>
    } else {
        return (<>
            <Col xs="auto">
                <Button type="button" variant="primary" onClick={handleSee}>See</Button>
            </Col>
            <Col xs="auto">
                <Button type="button" variant="secondary" onClick={() => handlers.update_f(collection)}>Update</Button>
            </Col>
            <Col xs="auto">
                <div className="vr" />
                <Button type="button" variant="danger" onClick={() => {if(window.confirm("Are you sure?")) handlers.delete_f(collection.id)}}>Delete</Button>
            </Col>
        </>)
    }
}

/* Default collection line form with state and creation, update, deletion management
If the create option is set, the form is in "creation" mode and allows creation instead of modification/deletion
*/
export default function CollectionForm({collection, update_f=null, delete_f=null, create_f=null}) {
    // Init an empty object as initial collection if collection is null
    const [collection_state, setCollection] = useState(collection);

    // Sets a collection element from a form value given the elem name
    function setCollectionElem(elem_name, value) {
        setCollection({
            ...collection_state, // Copies old state values
            [elem_name]: value // Change the value with elem_name
        });
    }

    return (
        <Form>
            <Row>

            <ShowId init={collection} show={create_f === null} />

            <EditCollectionName setter={setCollectionElem} init={collection}/>

            <EditEnableCheckbox setter={setCollectionElem} init={collection}/>

            <ButtonGroup collection={collection_state} handlers={{
                create_f,
                update_f,
                delete_f,
            }}/>

            </Row>
        </Form>
    )
}