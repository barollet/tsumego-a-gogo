import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();

    return <><p><Link to="/">Go to home</Link></p>
    <p>
        <Link
            to={'..'}
            onClick={(e) => {
            e.preventDefault();
            navigate(-1);
            }}
        >
            Go back
        </Link>
    </p>
  </>
}