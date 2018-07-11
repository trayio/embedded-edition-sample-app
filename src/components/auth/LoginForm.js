import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {white} from '@material-ui/core/colors/';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

class LoginForm extends React.Component {
    render() {
        const {onLogin} = this.props;
        const styles = {
            field: {marginTop: 10},
            btnSpan: {marginLeft: 5},
            loginContainer: {
                backgroundColor: white,
                minWidth: 320,
                maxWidth: 400,
                height: 'auto',
                position: 'absolute',
                top: '20%',
                left: 0,
                right: 0,
                margin: 'auto',
            },
            paper: {
                padding: 20,
                overflow: 'auto'
            },
            buttonsDiv: {
                textAlign: 'center',
                padding: 10
            },
            loginBtn: {
                marginTop: 20,
                float: 'right'
            },
            loginHeader: {
                textAlign: "center",
                marginBottom: 15,
            }
        };

        return (
            <div>
                <div style={styles.loginContainer}>
                    <Paper style={styles.paper}>
                        <Typography
                            style={styles.loginHeader}
                            variant="headline"
                        >
                            Login to OEM demo app
                        </Typography>
                        <form
                            ref={(elem) => this.form = elem}
                            onSubmit={(e) => {
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
                                variant="outlined"
                                color="primary"
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
                            Register New Account
                        </Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default LoginForm;
