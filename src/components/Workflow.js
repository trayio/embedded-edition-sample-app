import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import { withTheme } from "@material-ui/core/styles/index";
import React from 'react';
import Logs from './Logs';
import Loading from './Loading';
import DeleteDialog from './DeleteDialog';
import { get } from 'lodash';

import { openConfigWindow } from '../lib/configWindow';

import {
    getLogs,
    getWorkflow,
    deleteWorkflow,
    updateWorkflowConfig,
    updateWorkflowStatus,
} from '../api/workflows';

export class Workflow extends React.PureComponent {
    state = {
        error: false,
        loading: false,
        loadedLogs: false,
        workflowState: undefined,
        showDeleteDialog: false,
    }

    onClickConfigure = () => {
        const configWindow = openConfigWindow();

        updateWorkflowConfig(this.props.id).then(({body}) => {
            // After we generate the popup URL, set it to the previously opened
            // window:
            configWindow.location = body.data.popupUrl;
        });
    }

    loadWorkflow = () => {
        const enabled = get(this.state, 'workflowState', this.props.enabled);
        this.setState({workflowState: !enabled});

        getWorkflow(this.props.id).then(({ok, body}) => {
            if (ok) {
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
        });
    }

    updateWorkflowEnabled = () => {
        this.updateWorkflowStatus(true);
    }

    updateWorkflowDisabled = () => {
        this.updateWorkflowStatus(false);
    }

    updateWorkflowStatus = (enabled) => {
        this.setState({ loading: true });

        updateWorkflowStatus(this.props.id, enabled).then(({ok}) => {
            this.setState({ loading: false });

            if (ok) {
                return this.loadWorkflow();
            }
        })
        .catch(err => {
            alert(`Problem with stopping workflow ${this.props.id}. ${err}`);
        });
    }

    onCloseDialog = () => {
        this.setState({showDeleteDialog: false});
    }

    onShowDeleteDialog = () => {
        this.setState({showDeleteDialog: true});
    }

    onExpansionChange = () => {
        if (!this.state.loadedLogs) {
            this.loadLogs();
        }
    }

    loadLogs = () => {
        getLogs(this.props.id).then(({body}) => {
            this.setState({
                logs: body.data,
                loadedLogs: true,
            });
        });
    }

    renderWorkflowStatusButtons = enabled => {
        const styles = {
            width: "100%",
            marginBottom: "10px"
        };

        const startButton = (
            <Button
                style={styles}
                onClick={this.updateWorkflowEnabled}
                variant="outlined"
                color="primary"
            >
                Start
            </Button>
        );

        const stopButton = (
            <Button
                style={styles}
                onClick={this.updateWorkflowDisabled}
                variant="outlined"
                color="secondary"
            >
                Stop
            </Button>
        );

        return enabled ? stopButton : startButton;
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
            pill: {
                backgroundColor: enabled ? "#7ebc54" : "#df5252",
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
            },
            button: {
                width: "100%",
                marginBottom: "10px"
            },
        };

        return (
            <Loading loading={this.state.loading}>
                <ExpansionPanel
                    key={id}
                    style={styles.item}
                    onChange={this.onExpansionChange}
                >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <span style={styles.pill}>
                            {enabled ? "enabled" : "disabled"}
                        </span>
                        <Typography style={styles.name}>
                            {name}
                        </Typography>
                    </ExpansionPanelSummary>

                    <ExpansionPanelDetails>
                        <div
                            id="Logs"
                            style={{width: "100%", maxWidth: "700px"}}
                        >
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

                            {this.renderWorkflowStatusButtons(enabled)}

                            <Button
                                style={styles.button}
                                onClick={this.onShowDeleteDialog}
                                variant="outlined"
                                color="secondary"
                            >
                                Delete
                            </Button>
                        </div>

                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <DeleteDialog
                    id={this.props.id}
                    visible={this.state.showDeleteDialog}
                    onCloseDialog={this.onCloseDialog}
                    reload={this.props.loadAllWorkflows}
                />
            </Loading>
        );
    }

}

export default withTheme()(Workflow);