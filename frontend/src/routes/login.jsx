import React from 'react';

import { useNavigate } from "react-router-dom";

import axios_client from '../axios';

import { useLazyAxios } from '../hooks/use_axios';
import useUpdateEffect from '../hooks/use_update_effect';

import NavBar from '../components/nav_bar';
import ErrorMessage from '../components/small_components/error_message';

/*
The login/logout page.
Authentification is managed with a token in the sessionStorage
A default header is set and unset to put the token in headers
*/

export default function Login() {
    const [username, setUserName] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    const [token, setToken] = React.useState(window.sessionStorage.getItem("token"));

    const navigate = useNavigate();

    // Login request
    const [ login_trigger, login_data, login_error ] = useLazyAxios({
       url: '/user/login/',
       method: 'post',
       data: {
           username: username,
           password: password
       },
    },
    );

    // Logout request
    const [ logout_trigger, logout, logout_error ] = useLazyAxios({
        url: '/user/logout/',
        method: 'post',
        data: {},
    },
    );

    // loging handle effect
    useUpdateEffect(() => {
        // Sets the new token into local storage, login state and axios instance headers
        axios_client.defaults.headers.common['Authorization'] = "Token " + login_data.token;
        setToken(login_data.token);
        window.sessionStorage.setItem("token", login_data.token);

        // Go back to login page on successful login
        navigate("/");
    }, [login_data]);

    // logout handle effect
    useUpdateEffect(() => {
        // Remove the token from local state, axios headers and session storage
        window.sessionStorage.removeItem("token");
        delete axios_client.defaults.headers.common["Authorization"];
        setToken(null);
    }, [logout, logout_error]);

        return(<>
            <ErrorMessage pre={"loging error"} error={login_error} />
            <ErrorMessage pre={"logout error"} error={logout_error} />
            <NavBar />
            {token === null ? (
                <form>
                <label>
                    <p>Username</p>
                    <input type="text" name="username" onChange={e => setUserName(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" name="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="button" onClick={login_trigger}>Login</button>
                </div>
                </form>
            ) : (<>
                <h1>Logged in</h1>
                <button type="button" onClick={logout_trigger}>Logout</button>
            </>)}

        </>)
}