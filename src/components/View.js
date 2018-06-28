import React from 'react';
import Nav from './Nav';
import { withTheme } from '@material-ui/core/styles';

class View extends React.Component {
    render() {
        const { theme } = this.props;
        const styles = {
            header: {
                backgroundColor: "#2889ed",
                padding: 10,
                color: "white",
            },
        };

        return (
            <div>
                <div style={styles.header}>OEM Demo Application</div>
                <div style={{backgroundColor: "#f0f0f0", display: "flex",}}>
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
