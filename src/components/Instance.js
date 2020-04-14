import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import { withTheme } from "@material-ui/core/styles/index";
import React from 'react';
import Loading from './Loading';
import { get } from 'lodash';

import { openConfigWindow } from '../lib/configWindow';

import {
    updateSolutionInstance,
    updateSolutionInstanceConfig,
    deleteSolutionInstance,
} from '../api/solutions';
import {ConfigWizard} from "./ConfigWizard";
import TextField from "@material-ui/core/TextField";
import {getAuthCreateUrl} from "../api/me";
import {openAuthWindow} from "../lib/authWindow";

export class Instance extends React.PureComponent {
    state = {
        error: false,
        loading: false,
        instanceState: undefined,
        configWizardSrc: undefined,
        authExternalId: undefined,
        authUrlParams: ''
    };

    openWizard = (openInIframe, addCustomValidation = false) => {
        updateSolutionInstanceConfig(this.props.id).then(({body}) => {
            const url = addCustomValidation ? `${body.data.popupUrl}&customValidation=true` : body.data.popupUrl;

            if (!openInIframe) {
                const configWindow = openConfigWindow();
                configWindow.location = url;
            } else {
                this.setState({
                    configWizardSrc: url
                })
            }
        });
    };

    onClickConfigure = () => {
        this.openWizard(false,false);
    };

    onClickConfigureWithValidation = () => {
        this.openWizard(false,true);
    };

    onClickConfigureInIframe = () => {
        this.openWizard(true, false);
    };

    onClickEnable = () => {
        const enabled = get(this.state, 'instanceState', this.props.enabled);
        updateSolutionInstance(this.props.id, !enabled).then(()=>{
            this.setState({instanceState: !enabled});
        });
    };

    onClickDelete = () => {
        deleteSolutionInstance(this.props.id).then(this.props.loadAllSolutionInstances);
    }

    closeIframe = () => {
        this.setState({
            configWizardSrc: undefined
        })
    };

    onCreateAuth = () => {
        getAuthCreateUrl(this.props.id, this.state.authExternalId)
            .then(({body}) => {
                openAuthWindow(`${body.data.popupUrl}&${this.state.authUrlParams}`);
            })
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const {id, name} = this.props;
        const {configWizardSrc} = this.state;

        const enabled = get(this.state, 'instanceState', this.props.enabled);

        const styles = {
            controls: {
                margin: "10px",
                float: "right",
                maxWidth: '400px'
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
            textFields: {
                width: "100%",
                margin: "10px 0",
            }
        };

        return (
            <Loading loading={this.state.loading}>
                <ExpansionPanel
                    key={id}
                    style={styles.item}
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
                        <div id="Controls" style={styles.controls}>
                            <Button
                                style={styles.button}
                                onClick={this.onClickEnable}
                                variant="outlined"
                                color="primary"
                            >
                                {enabled ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                                style={styles.button}
                                onClick={this.onClickConfigure}
                                variant="outlined"
                                color="primary"
                            >
                                Configure
                            </Button>
                            <Button
                                style={styles.button}
                                onClick={this.onClickConfigureWithValidation}
                                variant="outlined"
                                color="primary"
                            >
                                Configure with custom validation
                            </Button>
                            <Button
                                style={styles.button}
                                onClick={this.onClickConfigureInIframe}
                                variant="outlined"
                                color="primary"
                            >
                                Configure in iframe
                            </Button>
                            <Button
                                style={styles.button}
                                onClick={this.onClickDelete}
                                variant="outlined"
                                color="primary"
                            >
                                Delete
                            </Button>
                            <Typography variant="title">
                                Create auth
                            </Typography>
                            <TextField
                                style={styles.textFields}
                                label="Auth external id"
                                value={this.state.authExternalId}
                                onChange={this.handleChange('authExternalId')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                style={styles.textFields}
                                label="Advanced Url Params"
                                value={this.state.authUrlParams}
                                onChange={this.handleChange('authUrlParams')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Button
                                style={styles.button}
                                onClick={this.onCreateAuth}
                                variant="outlined"
                                color="primary"
                                disabled={!this.state.authExternalId}
                            >
                                Create auth
                            </Button>
                        </div>
                        {configWizardSrc && <ConfigWizard src={configWizardSrc} onClose={this.closeIframe}/>}

                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Loading>
        );
    }

}

export default withTheme()(Instance);
