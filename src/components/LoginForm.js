import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {grey500, white} from '@material-ui/core/colors/';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Help from '@material-ui/icons/Help'
import Input from '@material-ui/core/Input';

class LoginForm extends React.Component {
    render() {
        const {onLogin} = this.props;
        const styles = {
            loginContainer: {
                backgroundColor: white,
                minWidth: 320,
                maxWidth: 400,
                height: 'auto',
                position: 'absolute',
                top: '20%',
                left: 0,
                right: 0,
                margin: 'auto'
            },
            paper: {
                padding: 20,
                overflow: 'auto'
            },
            buttonsDiv: {
                textAlign: 'center',
                padding: 10
            },
            field: {
                marginTop: 10,
            },
            loginBtn: {
                marginTop: 20,
                float: 'right'
            },
            btnSpan: {
                marginLeft: 5
            },
        };

        return (
            <div>
                <div style={styles.loginContainer}>

                    <Paper style={styles.paper}>

                        <form
                            ref={(elem) => this.form = elem}
                            onSubmit={(e) => {
                                console.log('---ONSUBMIT---');
                                e.preventDefault();
                                return onLogin({
                                    username: this.usernameElem.value,
                                    password: this.passwordElem.value
                                });
                            }}
                        >
                            <Input
                                inputRef={(input) => this.usernameElem = input}
                                label="Username"
                                placeholder="user"
                                fullWidth={true}
                            />
                            <Input
                                inputRef={(input) => this.passwordElem = input}
                                style={{marginTop: 10}}
                                label="Password"
                                placeholder="pass"
                                fullWidth={true}
                                type="password"
                            />

                            <Button
                                style={styles.loginBtn}
                                variant="raised" color="primary"
                                type='submit'
                            >
                                Login
                            </Button>

                        </form>
                    </Paper>

                    <div style={styles.buttonsDiv}>
                        <Button
                            label="Register"
                            href="/register"
                            icon={<PersonAdd/>}
                            color="secondary"
                        >
                            Register
                        </Button>

                        <Button
                            label="Forgot Password?"
                            href="/"
                            icon={<Help/>}
                            color="secondary"
                        >
                            Forgot Password
                        </Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default LoginForm;
