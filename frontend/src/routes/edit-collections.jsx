import ListGroup from 'react-bootstrap/ListGroup';

import CollectionForm from "../components/collection_form";
import NavBar from "../components/nav_bar";

import { sendRequest } from '../axios';
import { useAxios } from "../hooks/use_axios";
import useForceUpdate from '../hooks/use_force_update';

export default function CollectionsEdit() {
    const [collections, col_error, setCollections] = useAxios({
        url: `core/collection/`
    });

    const forceUpdate = useForceUpdate();

    async function handleCreate(collection) {
        const { response, error } = await sendRequest({
            url: `core/collection/`,
            method: 'post',
            data: collection,
        });
        if (response) {
            // Why works without state ?
            collections.push(response.data);
            // TODO understand why need to force update
            forceUpdate();
        } else {
            alert(error);
        }
    }

    async function handleDelete(collection_id) {
        console.log(collection_id);
        const { response, error } = await sendRequest({
            url: `core/collection/${collection_id}/`,
            method: 'delete',
        });
        if (response) {
            // If successful we delete the collection from the list
            const collection_index = collections.findIndex(c => c.id === collection_id);
            if (collection_index > -1) { // only splice array when item is found
                collections.splice(collection_index, 1);
                setCollections(collections);
                forceUpdate();
            }
        } else {
            alert(error);
        }
    }

    async function handleUpdate(collection) {
        const { error } = await sendRequest({
            url: `core/collection/${collection.id}/`,
            method: 'put',
            data: collection,
        });
        if (error) {
            alert(error);
        }
    }

    return (<>
        <NavBar />
        <h3>Liste des collections:</h3>
        <ListGroup>
            {collections && collections.map(collection => (
                <CollectionForm
                    key={collection.id}
                    collection={collection}
                    update_f={handleUpdate}
                    delete_f={handleDelete}
                />
            ))}
        </ListGroup>

        <h3>Créer une nouvelle collection:</h3>
        <CollectionForm
            collection={{name: "Nouvelle collection", enabled: true}}
            create_f={handleCreate}
        />
    </>)
}
