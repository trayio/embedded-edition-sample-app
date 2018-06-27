import React from 'react';

import {
    Link,
    Route,
    Switch,
    Redirect,
    withRouter,
    BrowserRouter as Router,
} from 'react-router-dom'

import {
    Login,
    Public,
    Register,
    Protected,
    AuthButton,
    PrivateRoute,
} from "./components/Auth";

import Account from "./components/views/Account";
import Discover from "./components/views/IntegrationsDiscover";
import Mine from "./components/views/IntegrationsMine";

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
