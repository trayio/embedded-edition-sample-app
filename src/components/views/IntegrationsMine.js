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

export class MineIntegrations extends React.PureComponent {

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
        workflows: [],
    }

    componentDidMount() {
        this.loadAllWorkflows();
    }

    loadAllWorkflows = () => {
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

    buildList(workflows) {
        return (
            <div>
                <div style={this.styles.list}>
                    <Typography variant="headline" style={{margin: "20px"}}>
                        My Workflows
                    </Typography>
                    {
                        workflows.map(({id}) => (
                            <Workflow
                                id={id}
                                key={id}
                                loadAllWorkflows={this.loadAllWorkflows}
                            />
                        ))
                    }
                </div>
            </div>
        );
    }

    render() {
        return (
            <View>
                <Loading loading={this.state.loading}>
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