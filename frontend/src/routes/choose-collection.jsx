import NavBar from "../components/nav_bar";

import { useAxios } from "../hooks/use_axios";

export default function ChooseCollection() {
    const [ collections, error ] = useAxios({
        url: "core/collection/?filter{enabled}=true",
    });
    
    console.log(collections);
    console.log(error);

    return (<>
    <NavBar />
    <h1>Coucou</h1>
    </>)
}