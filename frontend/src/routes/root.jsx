import { Link } from "react-router-dom";

export default function Root() {
    return (<>
      <h1>Hello world</h1>
      <Link to="login/">Login page</Link>
    </>);
  }