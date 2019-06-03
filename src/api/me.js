import {request} from '../lib/request';

export const me = () =>
    request('/api/me', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
            statusText: res.statusText,
        }))
