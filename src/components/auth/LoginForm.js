import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { white, red } from '@material-ui/core/colors/';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Build from '@material-ui/icons/Build';
import Input from '@material-ui/core/Input';
import ErrorMessage from './ErrorMessage';
import Cookies from 'js-cookie';

class LoginForm extends React.Component {

    handleSetupClick = () => {
		Cookies.remove('master_token');
		Cookies.remove('css_name');

        window.location.replace("/setup")
    };

	render() {
		const { onLogin } = this.props;
		const styles = {
			field: { marginTop: 10 },
			btnSpan: { marginLeft: 5 },
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
				overflow: 'auto',
			},
			buttonsDiv: {
				textAlign: 'center',
				padding: 10,
			},
			loginBtn: {
				marginTop: 20,
				float: 'right',
			},
			setupBtn: {
				marginTop: 20,
				borderSize: 1,
				float: 'left',
			},
			loginHeader: {
				textAlign: 'center',
				marginBottom: 15,
			},
		};

		return (
			<div>
				<div style={styles.loginContainer}>
					<Paper style={styles.paper} classes={{ root: 'LoginForm' }}>
						<h2 style={{ textAlign: 'center' }}>Login Form</h2>
						<form
							ref={elem => (this.form = elem)}
							onSubmit={e => {
								e.preventDefault();
								return onLogin({
									username: this.usernameElem.value,
									password: this.passwordElem.value,
								});
							}}
						>
							<Input
								inputRef={input => (this.usernameElem = input)}
								label="Username"
								style={{ marginTop: 10 }}
								placeholder="user"
								fullWidth={true}
							/>
							<Input
								inputRef={input => (this.passwordElem = input)}
								style={{ marginTop: 10 }}
								label="Password"
								placeholder="pass"
								fullWidth={true}
								type="password"
							/>

							<ErrorMessage
								title="Login failed"
								message={this.props.message}
							/>

							<Button
								style={styles.setupBtn}
								label="Register"
								onClick={this.handleSetupClick}
								color="primary"
								variant="outlined"
							>
								{<Build />}
							</Button>


							<Button
								style={styles.loginBtn}
								variant="outlined"
								color="primary"
								type="submit"
							>
								Login
							</Button>
						</form>
					</Paper>

					<div style={styles.buttonsDiv}>
						<Button
							label="Register"
							href="/register"
							icon={<PersonAdd />}
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
