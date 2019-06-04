import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Cookies from 'js-cookie';

export const auth = {
	isUserAuthenticated: false,
	isMasterAuthenticated: false,
};

export const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			Cookies.get('access_token') && Cookies.get('user_uuid') && Cookies.get('tray_id') ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: '/setup',
						state: { from: props.location },
					}}
				/>
			)
		}
	/>
);

export const RedirectMain = props =>
	Cookies.get('access_token') && Cookies.get('user_uuid') && Cookies.get('tray_id')? (
		<Redirect {...props} to="/solutions/discover" />
	) : (
		<Redirect {...props} to="/setup" />
	);
