import React from 'react';
import Nav from './Nav';
import {withTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

class View extends React.Component {
    render() {
        const { theme } = this.props;
        const styles = {
            header: {
                backgroundColor: "#2196F3",
                padding: "12px 10px",
                color: "white",
                fontWeight: 500,
                fontSize: "1.3rem",
            },
        };

        return (
            <div>
                <div style={styles.header}>OEM Demo Application</div>
                <div style={{backgroundColor: "#F5F5F5", display: "flex",}}>
                    <Nav/>
                    <div style={{width: "100%"}}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default withTheme()(View);
