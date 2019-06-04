import React from 'react';
import SetupForm from './SetupForm';
import Loading from '../Loading';
import Cookies from 'js-cookie';


export default class Login extends React.Component {
	state = {
		loading: false,
		redirectToReferrer: false,
	};

	showError = errorMessage =>
		this.setState({
			error: true,
			loading: false,
			message: errorMessage,
		});

	setup = data => {
		if (!data.token) {
			this.showError('Master token is required!');
		} else {
			Cookies.set('master_token', data.token);
			Cookies.set('partner_name', data.partner);

			window.location.replace('/login');
		}
	};

	render() {
		if (Cookies.get('master_token')) {
			window.location.replace('/login');
		}

		const style = {
			container: {
				height: '300px',
			},
			warning: {
				textAlign: 'center',
				border: 'none',
			},
		};

		return (
			<div style={style.container}>
				<Loading loading={this.state.loading}>
					<SetupForm
						onSetup={this.setup}
						error={this.state.error}
						message={this.state.message}
					/>
				</Loading>
			</div>
		);
	}
}
