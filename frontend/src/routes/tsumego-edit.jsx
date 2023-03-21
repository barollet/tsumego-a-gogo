import { useParams } from "react-router-dom";

import NavBar from "../components/nav_bar";

export default function TsumegoEdit() {
    const {tsumegoId} = useParams();
    return (<>
        <NavBar/>
        <h1>Coucou lo {tsumegoId}</h1>
    </>)
}