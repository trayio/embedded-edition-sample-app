import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './Router';
import registerServiceWorker from './registerServiceWorker';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Cookies from 'js-cookie';

const theme = createMuiTheme({
    palette: {
        type: 'light',
        primary: blue,
    },
});

const attachStyleSheet = () => {
    const head = document.head;
    const link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = `https://s3-eu-west-1.amazonaws.com/tray-emb-demo/${Cookies.get('partner_name')}/main.css`;

    head.appendChild(link);
}

ReactDOM.render((
    <div>
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <App/>
            </MuiThemeProvider>
        </BrowserRouter>
    </div>
), document.getElementById('root'));

registerServiceWorker();
attachStyleSheet();