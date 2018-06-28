import React from 'react';
import View from '../View';
import Error from '../Error';
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
import DialogTitle from '@material-ui/core/DialogTitle';

export class MineIntegrations extends React.Component {

    state = {
        loading: true,
        error: false,
        deleteWorkflow: false,
        workflows: {},
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

    onClickStop(id) {

    }

    onClickDelete(id) {
        this.setState({
            deleteWorkflow: id
        })
    }

    deleteWorkflow(id) {
        return fetch('/api/delete', {
            credentials: 'include',
            body: JSON.stringify({
                id: id,
            }),
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            credentials: 'include',

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

    buildWorkflowDetails(id) {
        const styles = {
            controls: {
                marginLeft: "10px"
            },
            button: {
                width: "100%",
                marginBottom: "10px"
            }
        };

        return (
            <ExpansionPanelDetails>
                <div className="Logs">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada
                    lacus ex,
                    sit amet blandit leo lobortis eget.
                </div>
                <div className="Controls" style={styles.controls}>
                    <Button
                        style={styles.button}
                        onClick={() => this.onClickConfigure(id)}
                        variant="contained"
                        color="primary"
                    >Configure</Button>
                    <Button
                        style={styles.button}
                        onClick={() => this.onClickStop(id)}
                        variant="contained"
                        color="secondary"
                    >Stop</Button>
                    <Button
                        style={styles.button}
                        onClick={() => this.onClickDelete(id)}
                        variant="contained"
                        color="secondary"
                    >Delete</Button>
                </div>
            </ExpansionPanelDetails>
        );
    }

    buildList(templates) {
        return (
            <div>
                <Typography variant="headline" style={{marginLeft: "20px", marginTop: "10px"}}>
                    My Workflows
                </Typography>
                <div>
                    <div>
                        <List>
                            {
                                templates.map(({name, id}, index) =>
                                    <ListItem key={index}>
                                        <ExpansionPanel>
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                <CloudCircle style={{paddingRight: "10px"}}/>
                                                <Typography>{name}</Typography>
                                            </ExpansionPanelSummary>
                                            {this.buildWorkflowDetails(id)}
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
                {this.buildDeleteConfirmDialog()}
                {data}
            </View>
        );
    }

}

export default MineIntegrations;