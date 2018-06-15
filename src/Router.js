import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter,
    Switch,
} from 'react-router-dom'
import {
    PrivateRoute,
    AuthButton,
    Login,
    Public,
    Register,
    Protected,
} from "./components/Auth";
import Dashboard from "./components/views/Dashboard";
import Account from "./components/views/Account";
import Billing from "./components/views/Billing";
import Integrations from "./components/views/Integrations";
import Nav from "./components/Nav";

const App = () => (
    <Router>
        <div>
            <Switch>
                <Redirect from="/" to="/dashboard"/>
            </Switch>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <PrivateRoute path="/dashboard" component={Dashboard}/>
            <PrivateRoute path="/account" component={Account}/>
            <PrivateRoute path="/billing" component={Billing}/>
            <PrivateRoute path="/integrations" component={Integrations}/>
        </div>
    </Router>
)

export default App
