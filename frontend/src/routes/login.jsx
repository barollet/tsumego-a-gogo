import React from 'react';

import { useNavigate } from "react-router-dom";

/*
The login/logout page.
Authentification is managed with a token in the sessionStorage
A default header is set and unset to put the token in headers
*/

import axios_client from '../axios';

// Remove the token from local state, axios headers and session storage
function removeToken(setToken) {
    window.sessionStorage.removeItem("token");
    delete axios_client.defaults.headers.common["Authorization"];
    setToken(null);
}

// Sets the new token into local storage, login state and axios instance headers
function addToken(token, setToken) {
    window.sessionStorage.setItem("token", token);
    axios_client.defaults.headers.common['Authorization'] = "Token " + token;
    setToken(token);
}

export default function Login() {
    const [username, setUserName] = React.useState();
    const [password, setPassword] = React.useState();

    const [token, setToken] = React.useState(window.sessionStorage.getItem("token"));

    const navigate = useNavigate();

    function handleLogin() {
        axios_client.post('/user/login/', {
            username: username,
            password: password
        }).then(function (response) {
            console.log('Authenticated');

            addToken(response.data.token, setToken);

            // Go back to login page on successful login
            navigate("/");
        })
        .catch(function (error) {
            // TODO ERROR MESSAGE
            console.log('Error on Authentication');
        });
    }

    function handleLogout() {
        axios_client.post('/user/logout/').then(function (response) {
            console.log('Logged out');

            removeToken(setToken);
          })
          .catch(function (error) {
            console.log(error);
            console.log('Error on Logout');

            removeToken(setToken);
          });
    }

    if (token === null) {
        return(
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
                <button type="button" onClick={handleLogin}>Login</button>
            </div>
            </form>
        )
    } else {
        return (<>
        <h1>Logged in</h1>
        <button type="button" onClick={handleLogout}>Logout</button>
        </>)
    }
    
}