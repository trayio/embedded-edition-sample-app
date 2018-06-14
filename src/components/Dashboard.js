import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Nav from './Nav';

export class Dashboard extends React.Component {
    render() {
        return <div>
            <h1>Hello, Dashboard</h1>
           {/* <Nav/>*/}
            <Button variant="raised" color="primary">
                Hello World
            </Button>
        </div>;
    }
}

export default Dashboard;