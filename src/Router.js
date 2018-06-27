import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    BrowserRouter as Router,
} from 'react-router-dom';

import {
    Login,
    Register,
    PrivateRoute,
} from "./components/Auth";

import Mine from "./components/views/IntegrationsMine";
import Account from "./components/views/Account";
import Discover from "./components/views/IntegrationsDiscover";

const App = () => (
    <Router>
        <div>
            <Switch>
                <Redirect exact from="/" to="/integrations/discover"/>
            </Switch>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <PrivateRoute path="/account" component={Account}/>
            <PrivateRoute path="/integrations/discover" component={Discover}/>
            <PrivateRoute path="/integrations/mine" component={Mine}/>
        </div>
    </Router>
);

export default App;
