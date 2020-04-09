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

import { openConfigWindow } from '../lib/configWindow';
import { listSolutions, createSolutionInstance } from '../api/solutions';

export class SolutionsDiscover extends React.PureComponent {

    state = {
        loading: true,
        error: false,
        solutions: [],
    }

    componentDidMount() {
        listSolutions()
            .then(({ok, body}) => {
                if (ok) {
                    this.setState({
                        solutions: body.data,
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

    onUseWorkflowClick(id, name) {
        const configWindow = openConfigWindow();

        createSolutionInstance(id, name).then(({body}) => {
            // After we generate the popup URL, set it to the previously opened
            // window:
            configWindow.location = body.data.popupUrl;
        });
    }

    buildList(solutions) {
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
                    Discover solutions
                </Typography>
                <Paper>
                    <List style={styles.list}>
                        {
                            solutions.map(({title, id}, index) =>
                                <ListItem
                                    divider={index !== solutions.length - 1}
                                    key={index}
                                >
                                    <ListItemText
                                        style={styles.text}
                                        primary={title}
                                        secondary={null}
                                    />
                                    <ListItemSecondaryAction
                                        onClick={() => this.onUseWorkflowClick(id, title)}
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
                            this.buildList(this.state.solutions)
                    }
                </Loading>
            </View>
        );
    }

}

export default SolutionsDiscover;
