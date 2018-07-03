import React from 'react';
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import {Redirect, Route, withRouter} from 'react-router-dom';
import Loading from "../Loading";
import {auth} from './Auth';

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
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (res.ok) {
                    auth.authenticate(() => {
                        this.setState(
                            {
                                redirectToReferrer: true,
                                loading: false
                            }
                        )
                    });
                } else {
                    res.json().then(body => {
                        alert(`Unable to login: ${JSON.stringify(body)}`);
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
            }
        }

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
                    <div>
                        <p style={style.warning}>You must log in to view the page at {from.pathname}</p>
                        <LoginForm onLogin={this.login}/>
                    </div>
                </Loading>
            </div>
        );
    }
}
