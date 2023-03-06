export const openAuthWindow = (url, accountId) => {
  // Must open window from user interaction code otherwise it is likely
  // to be blocked by a popup blocker:
  const authWindow = window.open(
    undefined,
    "_blank",
    "width=500,height=500,scrollbars=no"
  );

  const onmessage = (e) => {

    if(e.data.type === "tray.authpopup.accountIdRequest"){
        // If the user has the enhancedSessionSecurity option set, they will send a postMessage
        // requesting the account ID. Unless the client app responds with the appropriate ID
        // the session will not be validated
        e.source.postMessage({type: 'tray.authpopup.accountIdRequest', data: accountId},
                           e.origin);
    }

    if (e.data.type === "tray.authPopup.error") {
      // Handle popup error message
      alert(`Error: ${e.data.error}`);
      authWindow.close();
    }
    if (
      e.data.type === "tray.authpopup.close" ||
      e.data.type === "tray.authpopup.finish"
    ) {
    //   authWindow.close();
    }
  };
  window.addEventListener("message", onmessage);

  // Check if popup window has been closed
  const CHECK_TIMEOUT = 1000;
  const checkClosedWindow = () => {
    if (authWindow.closed) {
      window.removeEventListener("message", onmessage);
    } else {
      setTimeout(checkClosedWindow, CHECK_TIMEOUT);
    }
  };

  checkClosedWindow();
  authWindow.location = url;
};
