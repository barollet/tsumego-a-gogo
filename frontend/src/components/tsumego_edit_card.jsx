import { RawTsumego } from "./static_tsumego_view"

import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';

import axios_client from "../axios";

import "../css/tsumego_card.css"

export default function TsumegoEditCard({tsumego, display_coords=true}) {  
    const navigate = useNavigate();
    
    function handleDelete() {
        axios_client.delete(`core/tsumego/${tsumego.id}`).then((response) => {
            // Reload to update visu
            navigate(0);
        }).catch((error) => {
            console.log(error.response);
        });
    }

    function handleClick() {
        navigate(`/tsumego/edit/${tsumego.id}`);
    }

    return (
    <div >
        <div className="tsumego_hover" onClick={handleClick}>
            <RawTsumego key={tsumego.id} tsumego={tsumego} display_coords={display_coords}/>
        </div>
        <div>
            <Button type="button" variant="outline-danger" onClick={handleDelete}>Delete</Button>
            <p className="card_bot_elem">Number: {tsumego.number}</p>
        </div>
    </div>)
}