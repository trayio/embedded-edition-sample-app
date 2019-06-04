import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { white } from '@material-ui/core/colors/';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorMessage from './ErrorMessage';
import FormHeader from './FormHeader'
import SetupBtn from './SetupBtn'

class RegisterForm extends React.Component {
	explain =
		'This will create a new temporary end user account that lasts up to 12 hours';
		

	render() {
		const { onRegister } = this.props;
		const styles = {
			loginContainer: {
				backgroundColor: white,
				minWidth: 320,
				maxWidth: 400,
				height: 'auto',
				position: 'absolute',
				left: 0,
				right: 0,
				margin: '30px auto',
				top: '10%'
			},
			paper: {
				padding: 20,
				overflow: 'auto',
			},
			buttonsDiv: {
				textAlign: 'center',
				padding: 10,
			},
			field: {
				marginTop: 10,
			},
			loginBtn: {
				marginTop: 20,
				float: 'right',
			},
			btnSpan: {
				marginLeft: 5,
			},
			setupBtn: {
				marginTop: 20,
				borderSize: 1,
				float: 'left',
			},
		};

		return (
			<div>
				<div style={styles.loginContainer}>
					<Paper
						style={styles.paper}
						classes={{ root: 'RegisterForm' }}
					>
						{this.props.loading ? (
							<div style={{ textAlign: 'center' }}>
								<CircularProgress />
							</div>
						) : (
							<form
								ref={elem => (this.form = elem)}
								onSubmit={e => {
									e.preventDefault();
									return onRegister({
										name: this.nameElem.value,
										username: this.usernameElem.value,
										password: this.passwordElem.value,
									});
								}}
							>

								<FormHeader 
									title="Registration"
									explain={this.explain}
								/>

								<Input
									inputRef={input => (this.nameElem = input)}
									autoFocus={true}
									label="Name"
									placeholder="Full Name"
									fullWidth={true}
									style={{ marginBottom: 10 }}
									required
								/>

								<Input
									inputRef={input =>
										(this.usernameElem = input)
									}
									label="Username"
									placeholder="Username"
									fullWidth={true}
									style={{ marginBottom: 10 }}
									required
								/>

								<Input
									inputRef={input =>
										(this.passwordElem = input)
									}
									label="Password"
									placeholder="Password"
									fullWidth={true}
									type="password"
									required
								/>
								<ErrorMessage
									title="Registration  failed"
									message={this.props.message}
								/>

								<SetupBtn/>

								<Button
									style={styles.loginBtn}
									variant="raised"
									color="primary"
									type="submit"
								>
									Register User
								</Button>
							</form>
						)}
					</Paper>
				</div>
			</div>
		);
	}
}

export default RegisterForm;
