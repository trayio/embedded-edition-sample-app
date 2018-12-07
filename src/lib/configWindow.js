export const openConfigWindow = () => {
    // Must open window from user interaction code otherwise it is likely
    // to be blocked by a popup blocker:
    const configWindow = window.open(
        undefined,
        '_blank',
        'width=500,height=500,scrollbars=no',
    );

    // Listen to popup messages
    let configFinished = false;
    const onmessage = e => {
        if (e.data.type === 'tray.configPopup.error') {
            // Handle popup error message
            alert(`Error: ${e.data.err}`);
        }
        if (e.data.type === 'tray.configPopup.finish') {
            // Handle popup finish message
            configFinished = true;
        }
    };
    window.addEventListener('message', onmessage);

    // Check if popup window has been closed before finishing the configuration.
    // We use a polling function due to the fact that some browsers may not
    // display prompts created in the beforeunload event handler.
    const CHECK_TIMEOUT = 1000;
    const checkWindow = () => {
        if (configWindow.closed) {
            // Handle popup closing
            if (!configFinished) {
                alert('Configuration not finished');
            } else {
                console.log('Configuration finished');
            }
            window.removeEventListener('message', onmessage);
        } else {
            setTimeout(checkWindow, CHECK_TIMEOUT);
        }
    }

    checkWindow();

    return configWindow;
};
