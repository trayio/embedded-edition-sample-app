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
            controls: {marginLeft: "20px"},
            button: {width: "100%"},
            text: {fontWeight: "bold"},
            grid: {width: "100%"},
            header: {margin: "20px"},
            list: {
                margin: "10px",
                backgroundColor: "white",
            },
        };

        return (
            <Grid item style={styles.grid}>
                <Typography
                    variant="headline"
                    style={styles.header}
                >
                    Discover integrations
                </Typography>ƒ
                <div>
                    <List
                        disablePadding
                        style={styles.list}
                    >
                        {
                            templates.map(({title, id}, index) =>
                                <ListItem
                                    divider={index !== templates.length - 1}
                                    key={index}
                                >
                                    <ListItemText
                                        style={styles.text}
                                        primary={title}
                                        secondary={null}
                                    />
                                    <ListItemSecondaryAction
                                        onClick={() => this.handleClick(id)}
                                    >
                                        <Button
                                            style={styles.button}
                                            variant="outlined"
                                            color="primary"
                                        >
                                            Use
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