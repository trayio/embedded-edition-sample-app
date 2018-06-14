import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import App from './Router';
import registerServiceWorker from './registerServiceWorker';
import red from '@material-ui/core/colors/red';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import WithTheme from './WithTheme';

const theme = createMuiTheme({
    palette: {
        type: 'dark', // Switching the dark mode on is a single property value change.
        primary: red,
    },
});

ReactDOM.render((
    <BrowserRouter>
        <MuiThemeProvider theme={theme}>
            <App/>
        </MuiThemeProvider>
    </BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
