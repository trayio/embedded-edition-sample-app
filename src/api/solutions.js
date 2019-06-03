import { request } from '../lib/request';

export const listSolutions = () =>
    request('/api/solutions', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }));

export const listSolutionInstances = () =>
    request('/api/solutionInstances', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }));

export const createSolutionInstance = (id, name) =>
    request('/api/solutionInstances', {
        body: JSON.stringify({
            id: id,
            name: name,
        }),
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        credentials: 'include',
    }).then(async res => ({
        ok: res.ok,
        body: await res.json(),
    }));

export const updateSolutionInstance = (solutionInstanceId, enabled) =>
    request(`/api/solutionInstance/${solutionInstanceId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            enabled: enabled,
        }),
    }).then(async res => ({
        ok: res.ok,
    }));

export const updateSolutionInstanceConfig = solutionInstanceId =>
    request(`/api/solutionInstance/${solutionInstanceId}/config`, {
        method: 'PATCH',
        credentials: 'include',
    }).then(async res => ({
        ok: res.ok,
        body: await res.json(),
    }));

export const getSolutionInstance = id =>
    request(`/api/solutionInstance/${id}`, {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }));

export const deleteSolutionInstance = id =>
    request(`/api/solutionInstance/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then(async res => ({
            ok: res.ok,
        }));
