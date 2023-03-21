import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios_client from "../axios";

export default function TsumegoUpload({collectionId}) {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    function handleUpload() {
        if (file === null) {
            alert("Provide a file");
            return;
        }
        let formData = new FormData();
        if (file.name.endsWith(".sgf")) {
            formData.append("sgf", file);
        } else if (file.name.endsWith(".zip")) {
            formData.append("zip", file);
        } else {
            alert("Invalid file");
            return
        }

        console.log(formData);
        axios_client.post(`core/collection/${collectionId}/upload/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log(response.data);
            navigate(0);
        }).catch(error => console.log(error.response));
    }

    return (
        <>
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Add an sgf file or a zip file with multiple sgf in it. Solutions are not taken into account. Nothing is required except a raw SGF position.</Form.Label>
            <Form.Control type="file" accept=".sgf,.zip" onChange={(e) => {
                    setFile(e.target.files[0]);
                }}/>
        </Form.Group>
        <Button type="button" variant="success" onClick={handleUpload}>Upload</Button>
        </>
    )
}