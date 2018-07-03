import React from 'react';
import View from '../View';
import Error from '../Error';
import Logs from '../Logs';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloudCircle from '@material-ui/icons/CloudCircle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import {withTheme} from "@material-ui/core/styles/index";
import Loading from '../Loading';

export class MineIntegrations extends React.Component {

    state = {
        loading: true,
        error: false,
        deleteWorkflow: false,
        workflows: [],
    }

    componentDidMount() {
        this.loadAllWorkflows();
    }

    loadAllWorkflows() {
        fetch('/api/workflows', {credentials: 'include'}).then(res =>
            res.json().then(body => {
                if (res.ok) {
                    this.setState({
                        workflows: body.data,
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

    onClickConfigure(id) {
        alert(`You clicked CONFIGURE on workflow id ${id}`);
    }

    updateWorkflow(id, enabled) {

        this.setState({
            loading: true,
        })

        fetch(`/api/update/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(
                {
                    enabled,
                    id
                }
            ),
        })
            .then(res => {

                this.setState({
                    loading: false,
                })

                if (res.ok) {
                    this.loadAllWorkflows();
                } else {
                    alert(`Problem with stopping workflow ${id}`);
                }
            })
            .catch(err => {
                alert(`Problem with stopping workflow ${id}. ${err}`);
            });

    }

    onClickDelete(id) {
        this.setState({
            deleteWorkflow: id
        })
    }

    deleteWorkflow(id) {
        return fetch(`/api/workflows/${id}`, {
            credentials: 'include',
            method: 'DELETE',
        });
    }

    buildDeleteConfirmDialog() {
        return <Dialog
            open={this.state.deleteWorkflow}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this workflow?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    const id = this.state.deleteWorkflow;
                    this.deleteWorkflow(id).then(res => {
                        this.setState({deleteWorkflow: false});
                        this.loadAllWorkflows();
                    })
                }} color="secondary">
                    Yes
                </Button>
                <Button onClick={() => {
                    this.setState({deleteWorkflow: false})
                }} color="primary" autoFocus>
                    No
                </Button>
            </DialogActions>
        </Dialog>
    }

    buildWorkflowDetails(id, enabled, logs) {
        const styles = {
            controls: {
                marginLeft: "10px"
            },
            button: {
                width: "100%",
                marginBottom: "10px"
            }
        }

        const startButton = <Button style={styles.button} onClick={() => this.updateWorkflow(id, true)}
                                    variant="contained"
                                    color="primary">Start</Button>
        const stopButton = <Button style={styles.button} onClick={() => this.updateWorkflow(id, false)}
                                   variant="contained"
                                   color="secondary">Stop</Button>

        return <ExpansionPanelDetails>

            <div id="Logs" style={{width: "100%", maxWidth: "700px"}}>
                <Logs entries={logs}/>
            </div>

            <div id="Controls" style={styles.controls}>
                <Button style={styles.button} onClick={() => this.onClickConfigure(id)} variant="contained"
                        color="primary">Configure</Button>
                {enabled ? stopButton : startButton}
                <Button style={styles.button} onClick={() => this.onClickDelete(id)} variant="contained"
                        color="secondary">Delete</Button>
            </div>

        </ExpansionPanelDetails>
    }

    buildList(workflows) {
        console.log(workflows);
        const colors = {
            positive: this.props.theme.palette.primary.main,
            negative: this.props.theme.palette.secondary.main,
        }

        return (
            <div>
                <Typography variant="headline" style={{margin: "20px"}}>
                    My Workflows
                </Typography>
                <div>
                    <div>
                        <List>

                            {
                                workflows.map(({name, id, enabled, logs}, index) =>
                                    <ListItem key={index} style={{width: "100%"}}>
                                        <ExpansionPanel style={{width: "100%"}}>
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                <CloudCircle style={{marginRight: "10px"}}/>
                                                <Typography>{name}
                                                    <span style={{
                                                        marginLeft: "5px",
                                                        backgroundColor: enabled ? colors.positive : colors.negative,
                                                        color: "white",
                                                        borderRadius: "5px",
                                                        padding: "2px",
                                                    }}>{enabled ? "enabled" : "disabled"}</span>
                                                </Typography>
                                            </ExpansionPanelSummary>
                                            {this.buildWorkflowDetails(id, enabled, logs)}
                                        </ExpansionPanel>
                                    </ListItem>
                                )
                            }

                        </List>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <View>
                <Loading loading={this.state.loading}>
                    {this.buildDeleteConfirmDialog()}
                    {this.state.error ?
                        <Error msg={this.state.error}/> :
                        this.buildList(this.state.workflows)
                    }
                </Loading>
            </View>
        );
    }

}

export default withTheme()(MineIntegrations);