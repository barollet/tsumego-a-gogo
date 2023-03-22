import { useParams } from "react-router-dom";

import NavBar from "../components/nav_bar";

import axios_client from "../axios";

import { StaticTsumego } from "../components/tsumego_view";

export default function TsumegoEdit() {
    const {tsumegoId} = useParams();

    //const [tsumego, setTsumego] = useState([]);

    //useEffect(() => {
    //    axios_client.get(`core/tsumego/${tsumegoId}`).then((response) => {
    //        setTsumego(response.data);
    //    });
    //}, []);

    return (<>
        <NavBar/>
        <h1>Coucou lo {tsumegoId}</h1>
        <StaticTsumego tsumego={tsumegoId} display_coords={true}/>
    </>)
}