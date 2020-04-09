import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import AccountIcon from '@material-ui/icons/AccountCircle';
import AccountBox from '@material-ui/icons/AccountBox';
import PlugIcon from '@material-ui/icons/SettingsInputComponent';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CircleIcon from '@material-ui/icons/FiberManualRecord';
import { Link } from 'react-router-dom';

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        maxWidth: 250,
        backgroundColor: theme.palette.background.paper,
        paddingBottom: 40,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    link: {
        textDecoration: "none",
    }
});

class Nav extends React.PureComponent {
    state = {
        solutionsOpen: true,
    };

    handleSolutionsClick = () => {
        this.setState({solutionsOpen: !this.state.solutionsOpen});
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

                        <Link to="/authentications" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon>
                                    <AccountBox/>
                                </ListItemIcon>
                                <ListItemText inset primary="Authentications"/>

                            </ListItem>
                        </Link>

                        <ListItem button onClick={this.handleSolutionsClick}>
                            <ListItemIcon>
                                <PlugIcon/>
                            </ListItemIcon>
                            <ListItemText inset primary="Solutions"/>
                            {this.state.solutionsOpen ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>

                        <Collapse in={this.state.solutionsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>

                                <Link className={classes.link} to="/solutions/mine">
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon>
                                            <CircleIcon style={{borderRadius: 20}}/>
                                        </ListItemIcon>
                                        <ListItemText inset primary="My Instances" style={{whiteSpace: 'nowrap'}}/>
                                    </ListItem>
                                </Link>

                                <Link className={classes.link} to="/solutions/discover">
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

export default withStyles(styles)(Nav);
