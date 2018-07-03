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
import Workflow from '../Workflow';

export class MineIntegrations extends React.Component {

    styles = {
        list: {
            margin: "10px",
            maxWidth: "1000px",
            margin: 'auto',
            marginBottom: '30px',
            fontFamily: "Roboto, Helvetica, Arial, sans-serif"
        }
    }

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
            method: 'PATCH',
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

    buildList(workflows) {
        return (
            <div>
                <div style={this.styles.list}>
                    <Typography variant="headline" style={{margin: "20px"}}>
                        My Workflows
                    </Typography>
                    {
                        workflows.map(({name, id, enabled}, index) =>
                            <Workflow id={id}/>
                        )
                    }
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