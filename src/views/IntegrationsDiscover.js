import React from 'react';
import View from '../components/View';
import Error from '../components/Error';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Loading from '../components/Loading';

import { useWorkflow } from '../api/workflows';
import { listTemplates } from '../api/templates';

export class DiscoverIntegrations extends React.PureComponent {

    state = {
        loading: true,
        error: false,
        templates: [],
    }

    componentDidMount() {
        listTemplates()
            .then(({ok, body}) => {
                if (ok) {
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
            });
    }

    onUseWorkflowClick(id) {
        // Must open window from user interaction code otherwise it is likely
        // to be blocked by a popup blocker:
        const configWindow = window.open(
            undefined,
            '_blank',
            'width=500,height=500,scrollbars=no',
        );

        useWorkflow(id).then(({body}) => {
            // After we generate the popup URL, set it to the previously opened
            // window:
            configWindow.location = body.data.popupUrl;
        });
    }

    buildList(templates) {
        const styles = {
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
        };

        return (
            <Grid item style={styles.grid}>
                <Typography
                    variant="headline"
                    style={styles.header}
                >
                    Discover integrations
                </Typography>
                <Paper>
                    <List style={styles.list}>
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
                                        onClick={() => this.onUseWorkflowClick(id)}
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
                </Paper>
            </Grid>
        );
    }

    render() {
        return (
            <View>
                <Loading loading={this.state.loading}>
                    {
                        this.state.error ?
                            <Error msg={this.state.error}/> :
                            this.buildList(this.state.templates)
                    }
                </Loading>
            </View>
        );
    }

}

export default DiscoverIntegrations;