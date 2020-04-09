import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { PrivateRoute, RedirectMain } from "./components/auth/Auth";

import Demo from "./views/Demo";
import Account from "./views/Account";
import SolutionsMine from "./views/SolutionsMine";
import SolutionsDiscover from "./views/SolutionsDiscover";
import Authentications from "./views/Authentications";

const App = () => (
    <Router>
        <div>
            <Switch>
                <RedirectMain exact from="/"/>
            </Switch>
            <Route path="/demo" component={Demo}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <PrivateRoute path="/account" component={Account}/>
            <PrivateRoute path="/solutions/discover" component={SolutionsDiscover}/>
            <PrivateRoute path="/solutions/mine" component={SolutionsMine}/>
            <PrivateRoute path="/authentications" component={Authentications}/>
        </div>
    </Router>
);

export default App;
