import { Link } from "react-router-dom";

export default function Root() {
    return (<>
      <h1>Hello world</h1>
      <p><Link to="login/">Login page</Link></p>
      <p><Link to="collection/edit">See collections</Link></p>
      <p>Game modes</p>
      <p><Link to="play/collections">Choisir une collection</Link></p>
    </>);
  }