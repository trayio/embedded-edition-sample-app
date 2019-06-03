import {request} from '../lib/request';

export const listTemplates = () =>
    request('/api/templates', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }))
