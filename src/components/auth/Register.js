import React from 'react';
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import {Redirect, Route, withRouter} from 'react-router-dom';
import Loading from "../Loading";

export default class Register extends React.Component {
    state = {
        redirectToReferrer: false,
        error: false,
        success: false,
    }

    showError = () => this.setState({
        error: true
    });


    register = (data) => {
        fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {

                    this.setState({
                        success: true
                    })

                    setTimeout(() => {
                        window.location = '/login';
                    }, 3000);
                } else {
                    this.showError();
                }
            })
            .catch((err) => {
                this.showError();
            });
    }

    explain = 'This will create a new in-memory user account in the local Express backend that will persist until the backend is restarted.';

    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Register a New User</h1>
                <div style={{
                    textAlign: 'center',
                    width: '500px',
                    margin: 'auto',
                    paddingBottom: '10px'
                }}>{this.explain}</div>

                {this.state.error ? <h3 style={{color: "red", textAlign: "center"}}>Registration failed</h3> : ""}
                {this.state.success ? <h3 style={{color: "green", textAlign: "center"}}>Registration success</h3> : ""}
                <RegisterForm onRegister={this.register}/>
            </div>
        )
    }
}

