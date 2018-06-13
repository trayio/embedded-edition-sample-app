import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";

////////////////////////////////////////////////////////////
// 1. Click the public page
// 2. Click the protected page
// 3. Log in
// 4. Click the back button, note the URL each time

let session = undefined;

fetch('http://localhost:3001/content',
    {
        credentials: 'include',
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }
).then(res => {
    session = res.status === '200';
});

const AuthExample = () => (
    <Router>
        <div>
            {/*  <AuthButton/>*/}
            <ul>
                <li>
                    <Link to="/public">Public Page</Link>
                </li>
                <li>
                    <Link to="/protected">Protected Page</Link>
                </li>
            </ul>
            <Route path="/public" component={Public}/>
            <Route path="/login" component={Login}/>
            <PrivateRoute path="/protected" component={Protected}/>
        </div>
    </Router>
);

const auth = {
    isAuthenticated: () => session,
    authenticate(cb) {
        fetch('http://localhost:3001/login',
            {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: "amy", password: "amyspassword"})
            }
        ).then(res => {
            session = res.status === '200';
        });
    },
    signout(cb) {
        fetch('http://localhost:3001/logout',
            {
                method: 'post',
                body: JSON.stringify({})
            }
        );
    }
};

const AuthButton = withRouter(
    ({history}) =>
        auth.isAuthenticated().then(res => {
            res ? (
                <p>
                    Welcome!{" "}
                    <button
                        onClick={() => {
                            auth.signout(() => history.push("/"));
                        }}
                    >
                        Sign out
                    </button>
                </p>
            ) : (
                <p>You are not logged in.</p>
            )
        })
);


const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={props =>
                auth.isAuthenticated() ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: props.location}
                        }}
                    />
                )
            }
        />
    )
};

const Public = () => <h3>Public</h3>;
const Protected = () => <h3>Protected</h3>;

class Login extends React.Component {
    state = {
        redirectToReferrer: false
    };

    login = () => {
        auth.authenticate();
    };

    render() {
        const {from} = this.props.location.state || {from: {pathname: "/"}};
        const {redirectToReferrer} = this.state;

        if (redirectToReferrer) {
            return <Redirect to={from}/>;
        }

        return (
            <div>
                <p>You must log in to view the page at {from.pathname}</p>
                <button onClick={this.login}>Log in</button>
            </div>
        );
    }
}

export default AuthExample;