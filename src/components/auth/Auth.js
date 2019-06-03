import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {request} from '../../lib/request';
import Cookies from 'js-cookie';

export const auth = {
    isAuthenticated: false,

    authenticate(cb) {
        this.isAuthenticated = true
        if (typeof cb === 'function') {
            cb(true);
        }
    },

    signout(cb) {
        request('/api/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then((res) => {
				Cookies.remove('access_token');
                this.isAuthenticated = false;
                if (typeof cb === 'function') {
                    // user was logged out
                    cb(true);
                }
            })
            .catch((err) => {
                console.log('Error logging out user.');
                if (typeof cb === 'function') {
                    // user was not logged out
                    cb(false);
                }
            });
    }
};

export const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        Cookies.get('access_token') ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/setup',
                state: {from: props.location}
            }}/>
        )
    )}/>
);

export const RedirectMain = (props) => (
    Cookies.get('access_token')? (
        <Redirect {...props} to="/solutions/discover"/>
    ) : (
        <Redirect {...props} to="/setup"/>
    )
);
