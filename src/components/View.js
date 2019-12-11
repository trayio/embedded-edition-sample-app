import React from 'react';
import Nav from './Nav';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withTheme } from '@material-ui/core/styles';

class View extends React.Component {
    render() {
        const styles = {
            container: {
                backgroundColor: '#F5F5F5',
                display: 'flex',
                minHeight: 500,
                paddingBottom: 40,
            },
            content: { width: '100%' },
        };

        return (
            <div>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography variant="headline" color="inherit">
                            OEM Demo Application
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div style={styles.container}>
                    <Nav />
                    <div style={styles.content}>{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export default withTheme()(View);
