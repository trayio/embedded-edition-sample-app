import React from 'react';
import View from '../View';
import Error from '../Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export class DiscoverIntegrations extends React.Component {

    state = {
        loading: true,
        error: false,
        templates: {},
    }

    componentDidMount() {
        fetch('/api/templates', {credentials: 'include'}).then(res =>
            res.json().then(body => {
                if (res.ok) {
                    this.setState({
                        templates: body.data,
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

    handleClick(id) {
        fetch('/api/workflows', {
            body: JSON.stringify({
                id: id,
            }),
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            credentials: 'include',
        }).then(res => {
            res.json().then(body => {
                window.open(
                    body.data.popupUrl,
                    '_blank',
                    'width=500,height=500,scrollbars=no'
                );
            });
        });
    }

    buildList(templates) {
        const styles = {
            controls: {
                marginLeft: "20px"
            },
            button: {
                width: "100%",
            }
        };

        return (
            <Grid item style={{width: "100%"}}>
                <Typography variant="headline" style={{margin: "20px"}}>
                    Discover integrations
                </Typography>
                <div>
                    <List style={{margin: "0 20px"}}>
                        {
                            templates.map(({title, id}, index) =>
                                <ListItem key={index} style={{
                                    backgroundColor: "white",
                                    marginBottom: "20px",
                                }}>
                                    <ListItemText
                                        primary={title}
                                        secondary={null}
                                    />
                                    <ListItemSecondaryAction onClick={() => this.handleClick(id)}>
                                        <Button
                                            style={styles.button}
                                            variant="contained"
                                            color="primary">Use
                                        </Button>
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
                this.buildList(this.state.templates);
        }

        return (
            <View>
                {data}
            </View>
        );
    }

}

export default DiscoverIntegrations;