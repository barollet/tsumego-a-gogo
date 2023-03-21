import { useEffect, useState } from "react";

import ListGroup from 'react-bootstrap/ListGroup';

import axios_client from "../axios";

import CollectionForm from "../components/collection_form";
import NavBar from "../components/nav_bar";


export default function CollectionsEdit() {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        axios_client.get(`core/collection/`).then((response) => {
            setCollections(response.data);
        });
    }, []);

    return (
        <>
        <NavBar />
        <h3>Liste des collections:</h3>
        <ListGroup>
            {collections.map(collection => (
                <CollectionForm key={collection.id} collection={collection}/>
            ))}
        </ListGroup>

        <h3>Créer une nouvelle collection:</h3>
        <CollectionForm collection={{name: "Nouvelle collection", enabled: true}} create={true}/>
        </>
    )
}
