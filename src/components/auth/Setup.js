import React from 'react';
import SetupForm from './SetupForm'
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

        window.location.replace('/login');
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

        return (
            <div style={style.container}>
                <Loading loading={this.state.loading}>
                    <SetupForm onSetup={this.setup}/>
                </Loading>
            </div>
        );
    }
}
