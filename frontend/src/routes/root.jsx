import { Link } from "react-router-dom";

export default function Root() {
    return (<>
      <h1>Hello world</h1>
      <p><Link to="login/">Login page</Link></p>
      <p><Link to="collection/edit">See collections</Link></p>

    </>);
  }