//import {SimpleTsumego} from './tsumego_view.js';
import { useParams } from "react-router-dom";

import NavBar from "../components/nav_bar";

export default function CollectionEdit() {
    const { collectionId } = useParams();
return (
    <section>
    <NavBar />
    <h1>Amazing scientists</h1>

    <p>collection {collectionId}</p>


    </section>
);
}

/*

    <SimpleTsumego id={3} />
    <SimpleTsumego id={3} display_coords={true}/>
    <SimpleTsumego id={3} />
    */