export const openAuthWindow = (url) => {
    // Must open window from user interaction code otherwise it is likely
    // to be blocked by a popup blocker:
    const authWindow = window.open(
        undefined,
        '_blank',
        'width=500,height=500,scrollbars=no',
    );

    const onmessage = e => {
        console.log('message', e.data.type, e.data);

        if (e.data.type === 'tray.authPopup.error') {
            // Handle popup error message
            alert(`Error: ${e.data.error}`);
            authWindow.close();
        }
        if (e.data.type === 'tray.authpopup.close' || e.data.type === 'tray.authpopup.finish') {
            authWindow.close();
        }
    };
    window.addEventListener('message', onmessage);

    // Check if popup window has been closed
    const CHECK_TIMEOUT = 1000;
    const checkClosedWindow = () => {
        if (authWindow.closed) {
            window.removeEventListener('message', onmessage);
        } else {
            setTimeout(checkClosedWindow, CHECK_TIMEOUT);
        }
    }

    checkClosedWindow();
    authWindow.location = url;
};
