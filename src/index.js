import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import App from './Router';
import registerServiceWorker from './registerServiceWorker';
import blue from '@material-ui/core/colors/blue';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import WithTheme from './WithTheme';

const theme = createMuiTheme({
    palette: {
        type: 'light', // Switching the dark mode on is a single property value change.
        primary: blue,
    },
});

ReactDOM.render((
    <div style={
        {
            border: "thin gray solid",
            margin: "auto",
            maxWidth: "1200px",
            width: "100%"
        }
    }>
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <App/>
            </MuiThemeProvider>
        </BrowserRouter>
    </div>
), document.getElementById('root'));

registerServiceWorker();
