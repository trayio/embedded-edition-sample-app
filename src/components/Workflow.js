import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import {withTheme} from "@material-ui/core/styles/index";
import React from 'react';
import Logs from './Logs';
import Loading from './Loading';
import {get} from 'lodash';

export class Workflow extends React.PureComponent {
    styles = {
        pill: {
            borderRadius: "4px",
            marginRight: "10px",
            color: "white",
            padding: "3px 5px",
        },
        item: {
            width: '100%',
            border: 'none',
        },
        name: {
            marginTop: '2px'
        }
    }

    state = {
        error: false,
        loading: false,
        loadedLogs: false,
        deleteWorkflow: false,
        workflowState: undefined,
    }

    onClickConfigure = () => {
        fetch(`/api/workflows/${this.props.id}/config`, {
            method: 'PATCH',
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

    loadWorkflow = () => {
        const enabled = get(this.state, 'workflowState', this.props.enabled);
        this.setState({workflowState: !enabled});

        fetch(`/api/workflows/${this.props.id}`, {credentials: 'include'})
            .then(res =>
                res.json().then(body => {
                    if (res.ok) {
                        this.setState({
                            loading: false,
                            workflowState: body.data[0].enabled,
                        });
                    } else {
                        this.setState({
                            error: body,
                            loading: false,
                            workflowState: !enabled,
                        });
                    }
                })
            );
    }

    updateWorkflowEnabled = () => {
        this.updateWorkflowStatus(true);
    }

    updateWorkflowDisabled = () => {
        this.updateWorkflowStatus(false);
    }

    updateWorkflowStatus = (enabled) => {
        this.setState({
            loading: true,
        });

        fetch(`/api/workflows/${this.props.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({ id: this.props.id, enabled }),
        })
        .then(res => {
            this.setState({
                loading: false,
            });

            if (res.ok) {
                this.loadWorkflow();
            }
        })
        .catch(err => {
            alert(`Problem with stopping workflow ${this.props.id}. ${err}`);
        });
    }

    onClickDelete = () => {
        this.setState({deleteWorkflow: this.props.id});
    }

    deleteWorkflow = () => {
        return fetch(`/api/workflows/${this.props.id}`, {
            credentials: 'include',
            method: 'DELETE',
        });
    }

    buildDeleteConfirmDialog() {
        return (
            <Dialog
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
                        this.deleteWorkflow(this.props.id).then(res => {
                            this.setState({deleteWorkflow: false});
                            this.props.loadAllWorkflows();
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
        );
    }

    onExpansionChange = () => {
        if (!this.state.loadedLogs) {
            this.loadLogs();
        }
    }

    loadLogs = () => {
        fetch(`/api/workflows/${this.props.id}/logs`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                logs: res.data,
                loadedLogs: true,
            });
        });
    }

    render() {
        const {id, name} = this.props;
        const {logs, deleteWorkflow, loadedLogs} = this.state;

        const enabled = get(this.state, 'workflowState', this.props.enabled);

        const styles = {
            controls: {
                marginLeft: "10px",
                float: "right",
            },
            button: {
                width: "100%",
                marginBottom: "10px"
            },
            pill: {
                backgroundColor: enabled ? "#7ebc54" : "#df5252",
                ...this.styles.pill,
            }
        };

        const startButton = (
            <Button
                style={styles.button}
                onClick={this.updateWorkflowEnabled}
                variant="outlined"
                color="primary"
            >
                Start
            </Button>
        );

        const stopButton = (
            <Button
                style={styles.button}
                onClick={this.updateWorkflowDisabled}
                variant="outlined"
                color="secondary"
            >
                Stop
            </Button>
        );

        return (
            <Loading loading={this.state.loading}>
                <ExpansionPanel
                    key={id}
                    style={this.styles.item}
                    onChange={this.onExpansionChange}
                >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <span style={styles.pill}>{enabled ? "enabled" : "disabled"}</span>
                        <Typography style={this.styles.name}>{name}</Typography>
                    </ExpansionPanelSummary>

                    <ExpansionPanelDetails>
                        <div id="Logs" style={{width: "100%", maxWidth: "700px"}}>
                            <Logs
                                loading={!loadedLogs}
                                entries={logs}
                            />
                        </div>

                        <div id="Controls" style={styles.controls}>
                            <Button
                                style={styles.button}
                                onClick={this.onClickConfigure}
                                variant="outlined"
                                color="primary"
                            >
                                Configure
                            </Button>

                            {enabled ? stopButton : startButton}

                            <Button
                                style={styles.button}
                                onClick={this.onClickDelete}
                                variant="outlined"
                                color="secondary"
                            >
                                Delete
                            </Button>
                        </div>

                    </ExpansionPanelDetails>
                </ExpansionPanel>
                {deleteWorkflow ? this.buildDeleteConfirmDialog() : ''}
            </Loading>
        );
    }

}

export default withTheme()(Workflow);