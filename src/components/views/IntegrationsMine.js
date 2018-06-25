import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Nav from '../Nav';
import View from '../View';
import Error from '../Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloudCircle from '@material-ui/icons/CloudCircle';
import BuildIcon from '@material-ui/icons/Build';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


export class MyIntegrations extends React.Component {

    state = {
        loading: true,
        error: false,
        workflows: {},
    }

    componentDidMount() {
        fetch('/api/workflows', {credentials: 'include'}).then(res =>
            res.json().then(body => {
                if (res.ok) {
                    this.setState({
                        workflows: body,
                        loading: false,
                    });
                } else {
                    this.setState({
                        error: body,
                        loading: false,
                    });
                }
            })
        );
    }

    handleClick = e => {

    }

    buildList(workflows) {
        return (
            <Grid item>
                <Typography variant="title">My integrations</Typography>
                <div>
                    <List>
                        {
                            workflows.map((title, index) =>
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Avatar style={{backgroundColor: 'black'}}>
                                            <CloudCircle/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={title}
                                        secondary={null}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton aria-label="Delete">
                                            <BuildIcon onClick={(b) => this.handleClick(title)}/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        }
                    </List>
                </div>
           </Grid>
       );
    }



    render() {
        let data;

        if (this.state.loading) {
            data = <CircularProgress/>;
        } else {
            data = this.state.error ?
                <Error msg={this.state.error}/> :
                this.buildList(this.state.workflows);
        }

        return (
            <View>
                {data}
            </View>
        );
    }
}

export default MyIntegrations;
