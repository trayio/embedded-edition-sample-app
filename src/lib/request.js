import Cookies from 'js-cookie';

export const request = (path, options) =>
    fetch(path, {
        ...options,
        headers: {
            user_uuid: Cookies.get('user_uuid'),
            access_token: Cookies.get('access_token'),
            master_token: Cookies.get('master_token'),
            partner_name: Cookies.get('partner_name'),
            tray_id: Cookies.get('tray_id'),
            ...options.headers,
        }
    });