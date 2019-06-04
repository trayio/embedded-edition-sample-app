import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import { Link } from 'react-router-dom';
import Cookies  from  'js-cookie';

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
    },
    logo: {
        display: 'block',
        width: '100%',
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
                    {Cookies.get('css_name') &&
                        <img style={{width: '150px', display: 'block', padding: '20px 0', margin: '0 auto'}} src={`https://s3-eu-west-1.amazonaws.com/tray-emb-demo/${Cookies.get('css_name')}/logo.png`} />
                    }
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

                        <Link className={classes.link} to="/solutions/discover">
                            <ListItem button>
                                <ListItemIcon>
                                    <CircleIcon style={{borderRadius: 20}}/>
                                </ListItemIcon>
                                <ListItemText inset primary="Available Solutions"/>
                            </ListItem>
                        </Link>


                                <Link className={classes.link} to="/solutions/mine">
                                    <ListItem button>
                                        <ListItemIcon>
                                            <CircleIcon style={{borderRadius: 20}}/>
                                        </ListItemIcon>
                                        <ListItemText inset primary="My Active Instances" style={{whiteSpace: 'nowrap'}}/>
                                    </ListItem>
                                </Link>


                    </List>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Nav);
