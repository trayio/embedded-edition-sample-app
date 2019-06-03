import React from 'react';
import SetupForm from './SetupForm'
import { Redirect } from 'react-router-dom';
import Loading from "../Loading";
import Cookies from 'js-cookie';

export default class Login extends React.Component {
    state = {
        loading: false,
        redirectToReferrer: false
    }

    setup = (data) => {
        console.log('Setting up with ' + data.token);
        Cookies.set('master_token', data.token);
        Cookies.set('partner_name', data.partner);

        this.setState({
            redirectToReferrer: true,
        })
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

        const {redirectToReferrer} = this.state;

        if (redirectToReferrer) {
            return (
                <Redirect to={'/login'}/>
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
