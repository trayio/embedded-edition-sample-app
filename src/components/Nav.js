import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import AccountIcon from '@material-ui/icons/AccountCircle';
import PlugIcon from '@material-ui/icons/SettingsInputComponent';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CircleIcon from '@material-ui/icons/FiberManualRecord';
import {Link} from 'react-router-dom';

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        maxWidth: 250,
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        paddingBottom: 40,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    link: {
        textDecoration: "none",
    }
});

class NestedList extends React.Component {
    state = {
        open: true
    };

    handleClick = () => {
        this.setState({open: !this.state.open});
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                <div className={classes.root}>
                    <List
                        component="nav"
                    >
                        <Link to="/account" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon>
                                    <AccountIcon/>
                                </ListItemIcon>
                                <ListItemText inset primary="Account"/>

                            </ListItem>
                        </Link>

                        <ListItem button onClick={this.handleClick}>
                            <ListItemIcon>
                                <PlugIcon/>
                            </ListItemIcon>
                            <ListItemText inset primary="Integrations"/>
                            {this.state.open ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>

                        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>

                                <Link className={classes.link} to="/integrations/mine">
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon>
                                            <CircleIcon style={{borderRadius: 20}}/>
                                        </ListItemIcon>
                                        <ListItemText inset primary="Mine"/>
                                    </ListItem>
                                </Link>

                                <Link className={classes.link} to="/integrations/discover">
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon>
                                            <CircleIcon style={{borderRadius: 20}}/>
                                        </ListItemIcon>
                                        <ListItemText inset primary="Discover"/>
                                    </ListItem>
                                </Link>

                            </List>
                        </Collapse>
                    </List>
                </div>
            </div>
        );
    }
}

NestedList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NestedList);