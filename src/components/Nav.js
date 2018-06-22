import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import AccountIcon from '@material-ui/icons/AccountCircle';
import PlugIcon from '@material-ui/icons/SettingsInputComponent';
import ChartIcon from '@material-ui/icons/Assessment';
import PaymentIcon from '@material-ui/icons/Payment';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CircleIcon from '@material-ui/icons/FiberManualRecord';
import {Link} from 'react-router-dom';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 250,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    link: {
        textDecoration: "none",
    }
});

class NestedList extends React.Component {
    state = {open: true};

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
                        {/*1---------------------*/}
                        <Link className={classes.link} to="/dashboard">
                            <ListItem button>
                                <ListItemIcon>
                                    <ChartIcon/>
                                </ListItemIcon>
                                <ListItemText inset primary="Dashboard"/>
                            </ListItem>
                        </Link>
                        {/*2---------------------*/}
                        <Link to="/account" className={classes.link}>
                            <ListItem button>

                                <ListItemIcon>
                                    <AccountIcon/>
                                </ListItemIcon>
                                <ListItemText inset primary="Account"/>

                            </ListItem>
                        </Link>
                        {/*3---------------------*/}

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

                        {/*4---------------------*/}

                        <Link className={classes.link} to="/billing">
                            <ListItem button>
                                <ListItemIcon>
                                    <PaymentIcon/>
                                </ListItemIcon>
                                <ListItemText inset primary="Billing"/>
                            </ListItem>
                        </Link>
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