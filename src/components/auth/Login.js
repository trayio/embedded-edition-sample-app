import React from 'react';
import LoginForm from './LoginForm';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
import { request } from '../../lib/request';
import Cookies from 'js-cookie';

export default class Login extends React.Component {
	state = {
		error: false,
		loading: false,
		redirectToReferrer: false,
	};

	showError = errorMessage =>
		this.setState({
			error: true,
			loading: false,
			message: errorMessage,
		});

	login = data => {
		this.setState({
			loading: true,
		});
		request('/api/login', {
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => {
				if (res.ok) {
					res.json().then(body => {
						Cookies.set('access_token', body.userAccessToken);
						Cookies.set('tray_id', body.userTrayID);
						Cookies.set('user_uuid', body.userUUID);
						this.setState({
							redirectToReferrer: true,
							loading: false,
						});
					});
				} else {
					res.json().then(body => {
						this.showError(body.error);
					});
				}
			})
			.catch(err => {
				this.showError('');
			});
	};


	render() {
		const style = {
			container: {
				height: '300px',
			},
			warning: {
				textAlign: 'center',
				border: 'none',
			},
		};

		const { from } = this.props.location.state || {
			from: { pathname: '/' },
		};
		const { redirectToReferrer } = this.state;

		if (redirectToReferrer) {
			return <Redirect to={from} />;
		}

		return (
			<div style={style.container}>
				<Loading loading={this.state.loading}>
					<LoginForm
						onLogin={this.login}
						error={this.state.error}
						message={this.state.message}
					/>
				</Loading>
			</div>
		);
	}
}
