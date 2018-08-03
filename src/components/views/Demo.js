import React from 'react';
import View from '../View';
import Error from '../Error';
import Loading from '../Loading';

export class Demo extends React.PureComponent {
    state = {
        templates: [],
        workflows: [],
    }

    componentDidMount() {
        // Generate user token for trayid in process.env
        // warn user if trayid is not existent

        // fetch templates and workflows to display in list
    }

    render() {
        const styles = {
            header: {
                color: 'rgb(21, 27, 38)',
                fontSize: '13px',
                fontFamily: 'Helvetica',
            },
            container: {
                padding: '20px 30px',
            },
        }

        return (
            <div style={styles.container}>
                <h2 style={styles.header}>Available Apps</h2>
                <h2 style={styles.header}>Authorized Apps</h2>
            </div>
        );
    }
}

export default Demo;
