import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './Router';
import registerServiceWorker from './registerServiceWorker';
import AdminProvider from './components/admin/AdminProvider';

ReactDOM.render(
    <div>
        <BrowserRouter>
            <AdminProvider>
                <App />
            </AdminProvider>
        </BrowserRouter>
    </div>,
    document.getElementById('root')
);

registerServiceWorker();
