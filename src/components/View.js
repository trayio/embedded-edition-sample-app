import React from 'react';
import Nav from './Nav';
import { withTheme } from '@material-ui/core/styles';

class View extends React.Component {
    render() {
        const styles = {
            header: {
                backgroundColor: "#2196F3",
                padding: "12px 10px",
                color: "white",
                fontWeight: 500,
                fontSize: "1.3rem",
            },
            container: {
                backgroundColor: "#F5F5F5",
                display: "flex",
                minHeight: 500,
                paddingBottom: 40,
            },
            content: {width: "100%"},
        };

        return (
            <div>
                <div style={styles.header}>OEM Demo Application</div>
                <div style={styles.container}>
                    <Nav/>
                    <div style={styles.content}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default withTheme()(View);
