import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Nav from './Nav';
import { withTheme } from '@material-ui/core/styles';

class View extends React.Component {
    render() {
        const { theme } = this.props;
        const styles = {
            header: {
                backgroundColor: theme.palette.primary.main,
                padding: 10,
            }
        };

        return <div>
            <div style={styles.header}> Acme Inc.</div>
            <div style={{backgroundColor: "lightgray", display: "flex",}}>
                <Nav/>
                <div>
                    {this.props.children}
                </div>
            </div>
        </div>;
    }
}

export default withTheme()(View);