//import {SimpleTsumego} from './tsumego_view.js';
import { useParams } from "react-router-dom";

import NavBar from "../components/nav_bar";

import { SimpleTsumego } from "../components/static_tsumego_view";

export default function CollectionEdit() {
    const { collectionId } = useParams();
return (
    <section>
    <NavBar />
    <h1>Amazing scientists</h1>

    <p>collection {collectionId}</p>

    <SimpleTsumego id={3} display_coords={true}/>

    </section>
);
}
