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
import React from 'react';
import View from './View';
import Error from './Error';
import Logs from './Logs';
import Loading from './Loading';

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
        loading: true,
        error: false,
        deleteWorkflow: false,
    }

    componentDidMount() {
        this.loadWorkflow(this.props.id);
    }

    onClickConfigure(id) {
        alert(`You clicked CONFIGURE on workflow id ${id}`);
    }

    loadWorkflow(id) {
        fetch(`/api/workflow/${id}`, {credentials: 'include'})
        .then(res =>
            res.json().then(body => {
                console.log(body);
                if (res.ok) {
                    this.setState({
                        ...body,
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

    updateWorkflow(id, enabled) {
        this.setState({
            loading: true,
        });

        fetch(`/api/update/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({ id, enabled }),
        })
        .then(res => {

            this.setState({
                loading: false,
                enabled: !this.state.enabled,
            });

            if (res.ok) {
                this.loadWorkflow(this.props.id);
            } else {
                alert(`Problem with stopping workflow ${id}`);
            }
        })
        .catch(err => {
            alert(`Problem with stopping workflow ${id}. ${err}`);
        });

    }

    onClickDelete(id) {
        this.setState({deleteWorkflow: id});
    }

    deleteWorkflow(id) {
        return fetch(`/api/workflows/${id}`, {
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

    render() {
        const {id} = this.props;
        const {enabled, logs, name, deleteWorkflow} = this.state;

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
                onClick={() => this.updateWorkflow(id, true)}
                variant="outlined"
                color="primary"
            >
                Start
            </Button>
        );

        const stopButton = (
            <Button
                style={styles.button}
                onClick={() => this.updateWorkflow(id, false)}
                variant="outlined"
                color="secondary"
            >
                Stop
            </Button>
        );

        return (
            <Loading loading={this.state.loading}>
                <ExpansionPanel key={id} style={this.styles.item}>

                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        <span style={styles.pill}>{enabled ? "enabled" : "disabled"}</span>
                        <Typography style={this.styles.name}>{name}</Typography>
                    </ExpansionPanelSummary>

                    <ExpansionPanelDetails>
                        <div id="Logs" style={{width: "100%", maxWidth: "700px"}}>
                            <Logs entries={logs}/>
                        </div>

                        <div id="Controls" style={styles.controls}>
                            <Button
                                style={styles.button}
                                onClick={() => this.onClickConfigure(id)}
                                variant="outlined"
                                color="primary"
                            >
                                Configure
                            </Button>

                            {enabled ? stopButton : startButton}

                            <Button
                                style={styles.button}
                                onClick={() => this.onClickDelete(id)}
                                variant="outlined"
                                color="secondary"
                            >
                                Delete
                            </Button>
                        </div>

                    </ExpansionPanelDetails>
                </ExpansionPanel>
                {deleteWorkflow ? this.buildDeleteConfirmDialog(id) : ''}
            </Loading>
        );
    }

}

export default withTheme()(Workflow);