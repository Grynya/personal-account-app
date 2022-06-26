import React, { useState, useEffect } from "react";
import UserService from "../services/UserService";
import Loading from "./Loading";
import {Navigate, Outlet} from "react-router";

const ProtectedRoute = () => {
    const [state, setState] = useState('loading');

    useEffect(() => {
        (async function () {
            try {
                const isUserLogged = await new UserService().isLoggetIn();
                setState(isUserLogged.data ? 'loggedin' : 'redirect');
            } catch {
                setState('redirect');
            }
        })();
    }, []);

    if (state === 'loading') {
        return <Loading/>
    }
    return state === 'loggedin' ? <Outlet/> : <Navigate to="/login"/>;
}

export default ProtectedRoute;
