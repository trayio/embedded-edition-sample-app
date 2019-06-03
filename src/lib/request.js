export const request = (path, options) =>
    fetch(path, {
        ...options,
        headers: {
            ...options.headers,
        }
    });