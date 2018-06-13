import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import {
    PrivateRoute,
    AuthButton,
    Login,
    Public,
    Register,
    Protected,
} from "./components/Auth";

const App = () => (
    <Router>
        <div>
            <AuthButton/>
            <ul>
                <li><Link to="/public">Public Page</Link></li>
                <li><Link to="/protected">Protected Page</Link></li>
                <li><Link to="/register">Register a New User</Link></li>
            </ul>
            <Route path="/public" component={Public}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <PrivateRoute path="/protected" component={Protected}/>
        </div>
    </Router>
)

export default App
