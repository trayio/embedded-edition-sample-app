import React from 'react';
import {Redirect, Route, withRouter} from 'react-router-dom';

export const auth = {
    isAuthenticated: false,

    authenticate(cb) {
        this.isAuthenticated = true
        if (typeof cb === 'function') {
            cb(true)
        }
    },

    signout(cb) {
        fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        })
            .then((res) => {
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

export const AuthButton = withRouter(({history}) => (
    auth.isAuthenticated ? (
        <p>
            Welcome! <button onClick={() => {
            auth.signout(() => history.push('/'))
        }}>Sign out</button>
        </p>
    ) : (
        <p>You are not logged in.</p>
    )
));

export const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        auth.isAuthenticated ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: {from: props.location}
            }}/>
        )
    )}/>
);