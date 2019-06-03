import React from 'react';
import SetupForm from './SetupForm'
import { Redirect } from 'react-router-dom';
import Loading from "../Loading";
import { auth } from './Auth';
import Cookies from 'js-cookie';

export default class Login extends React.Component {
    state = {
        loading: false,
        redirectToReferrer: false
    }

    setup = (data) => {
        console.log('Setting up with ' + data.token);
        this.setState({
            loading: true
        })
        fetch('/api/setup', {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (res.ok) {
                    Cookies.set('master_token', data.token);
                    Cookies.set('partner_name', data.partner);

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
                    <SetupForm onSetup={this.setup}/>
                </Loading>
            </div>
        );
    }
}
