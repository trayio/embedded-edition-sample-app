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
import Dashboard from "./components/Dashboard";

const App = () => (
    <Router>
        <div>
            <Switch>
                <Redirect from="/" to="/dashboard"/>
            </Switch>
            <Route path="/public" component={Public}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <PrivateRoute path="/dashboard" component={Dashboard}/>
        </div>
    </Router>
)

export default App
