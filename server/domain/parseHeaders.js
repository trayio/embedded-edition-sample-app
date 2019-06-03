export function parseHeaders(req) {
	return {
		users_uuid: req.headers['user_uuid'],
		access_token: req.headers['access_token'],
		master_token: req.headers['master_token'],
		partner_name: req.headers['partner_name'],
		tray_id: req.headers['tray_id'],
	};
}
