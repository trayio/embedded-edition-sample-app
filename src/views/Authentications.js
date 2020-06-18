import React from 'react';
import View from '../components/View';
import Error from '../components/Error';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withTheme } from "@material-ui/core/styles/index";
import Loading from '../components/Loading';
import { listAuths, getAuthEditUrl } from '../api/me';
import { openAuthWindow } from "../lib/authWindow";
import { getAuthCreateUrl } from "../api/me";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from '@material-ui/icons/Refresh';

export class Authentications extends React.PureComponent {

    styles = {
        controls: {marginLeft: "20px"},
        button: {width: "100%"},
        text: {fontWeight: "bold"},
        grid: {
            maxWidth: "900px",
            margin: "20px auto",
        },
        header: {margin: "20px"},
        list: {
            margin: "10px",
            maxWidth: "1000px",
            backgroundColor: "white",
        },
        advancedInput: {
            flex: 1,
        }
    };

    state = {
        loading: true,
        error: false,
        auths: [],
        params: '',
    }

    componentDidMount() {
        this.loadAuths();
    }

    loadAuths = () => {
        this.setState({
            loading: true
        }, () => {
            listAuths()
                .then(({ok, body}) => {
                    if (ok) {
                        this.setState({
                            auths: body.data || [],
                            loading: false,
                        });
                    } else {
                        this.setState({
                            error: body,
                            loading: false,
                        });
                    }
                });
        });
    }


    onCreateAuth = () => {
        getAuthCreateUrl()
            .then(({body}) => {
                openAuthWindow(`${body.data.popupUrl}&${this.state.params}`);
            })
    };

    buildList() {
        return (
            <Paper>
                <List style={this.styles.list}>
                    <Loading loading={this.state.loading}>
                        {
                            this.state.auths.map(({id, name}, index) =>
                                <ListItem
                                    divider={index !== this.state.auths.length - 1}
                                    key={index}
                                >
                                    <ListItemText
                                        style={this.styles.text}
                                        primary={name}
                                        secondary={null}
                                    />
                                    <ListItemSecondaryAction onClick={this.showAuthWindow(id)}>
                                        <Button
                                            style={this.styles.button}
                                            variant="outlined"
                                            color="primary"
                                        >
                                            Edit
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        }
                    </Loading>
                </List>
            </Paper>
        );
    }

    showAuthWindow = (id) => () => {
        getAuthEditUrl(id)
            .then(({body}) => {
                openAuthWindow(`${body.data.popupUrl}&${this.state.params}`);
            })
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        return (
            <View>
                <Grid item style={this.styles.grid}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <Typography
                            variant="headline"
                            style={this.styles.header}
                        >
                            Authentications
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={this.state.loading}
                            onClick={this.onCreateAuth}
                            style={this.styles.header}
                        >
                            New
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={this.state.loading}
                            onClick={this.loadAuths}
                            style={this.styles.header}
                        >
                            Refresh
                            <RefreshIcon />
                        </Button>
                        <TextField
                            id="params"
                            label="Advanced Url Params"
                            value={this.state.params}
                            onChange={this.handleChange('params')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={this.styles.advancedInput}
                        />
                    </Grid>
                    {this.state.error ?
                        <Error msg={this.state.error}/> :
                        this.buildList()
                    }
                </Grid>
            </View>
        );
    }

}

export default withTheme()(Authentications);
