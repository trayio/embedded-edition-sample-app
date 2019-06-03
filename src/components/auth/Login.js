import React from 'react';
import LoginForm from './LoginForm'
import { Redirect } from 'react-router-dom';
import Loading from "../Loading";
import { auth } from './Auth';
import { request } from '../../lib/request';
import Cookies from 'js-cookie';

export default class Login extends React.Component {
    state = {
        loading: false,
        redirectToReferrer: false
    }

    login = (data) => {
        console.log('Logging in ' + data.username);
        this.setState({
            loading: true
        })
        request('/api/login', {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (res.ok) {
                    res.json().then(body => {
                        Cookies.set('access_token', body.userAccessToken);
                        auth.authenticate(() => {
                            this.setState(
                                {
                                    redirectToReferrer: true,
                                    loading: false
                                }
                            )
                        });
                    });
                } else {
                    res.json().then(body => {
                        alert(`Unable to login: ${body.error}`);
                        this.setState(
                            {
                                loading: false
                            }
                        )
                    });
                }
            })
            .catch((err) => {
                console.error('Error logging in.', err);
            });
    }

    render() {
        const style = {
            container: {
                height: "300px",
            },
            warning: {
                textAlign: "center",
                border: "none",
            },
        };

        const {from} = this.props.location.state || {from: {pathname: '/'}};
        const {redirectToReferrer} = this.state;

        if (redirectToReferrer) {
            return (
                <Redirect to={from}/>
            );
        }

        return (
            <div style={style.container}>
                <Loading loading={this.state.loading}>
                        <LoginForm onLogin={this.login}/>
                </Loading>
            </div>
        );
    }
}
