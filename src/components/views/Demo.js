import React from 'react';
import View from '../View';
import Error from '../Error';
import Loading from '../Loading';

import { listTemplates } from '../../api/templates';
import { listWorkflows, useWorkflow, deleteWorkflow, updateWorkflowConfig } from '../../api/workflows';

import './demo.css';

import config from '../../config.js';

export class Demo extends React.PureComponent {
    state = {
        templates: null,
        workflows: null,
        loadingWorkflows: true,
        loadingTemplates: true,
    }

    componentDidMount() {
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username: config.username,
                password: config.password,
            }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            listTemplates().then(({body}) => {
                this.setState({templates: body.data, loadingTemplates: false});
            });

            listWorkflows().then(({body}) => {
                this.setState({workflows: body.data, loadingWorkflows: false});
            });
        });
    }

    calculateWorkflowSize() {
        if (!this.state.workflows || !this.state.workflows.length) {
            return 0;
        }

        return 40 + this.state.workflows.length * 18;
    }

    calculateTemplateSize() {
        if (!this.state.templates || !this.state.templates.length) {
            return 0;
        }

        return this.state.templates.length * 20;
    }

    calculateSize() {
        const standardContentHeight = 129;
        return standardContentHeight + this.calculateWorkflowSize() + this.calculateTemplateSize();
    }

    onClickActivateIntegration = id => {
        useWorkflow(id).then(({body}) => {
            window.open(
                body.data.popupUrl,
                '_blank',
                'width=500,height=500,scrollbars=no'
            );
            listWorkflows().then(({body}) => {
                this.setState({workflows: body.data, loadingWorkflows: false});
            });
        });
    }

    onClickDeactivateIntegration = id => {
        deleteWorkflow(id).then(() => {
            listWorkflows().then(({body}) => {
                this.setState({workflows: body.data, loadingWorkflows: false});
            });
        });
    }

    onReconfigureIntegration = id => {
        updateWorkflowConfig(id).then(({body}) => {
            window.open(
                body.data.popupUrl,
                '_blank',
                'width=500,height=500,scrollbars=no'
            );
        });
    }

    renderIntegrations() {
        return this.state.templates && this.state.templates.map(i => {
            return (
                <div className="integration-container">
                    <a className="integration-name" href="#">{i.title}</a>
                    <span
                        className="activate"
                        onClick={() => this.onClickActivateIntegration(i.id)}
                    >
                        Activate
                    </span>
                </div>
            );
        });
    }

    renderWorkflows() {
        if (!this.state.workflows || !this.state.workflows.length) return null;

        return (
            <div className="workflow-container">
                <div className="workflow-header">
                    <h3 className="app-name">App Name</h3>
                </div>

                {this.state.workflows.map(w => {
                    return (
                        <div className="workflow-container">
                            <a
                                href="%"
                            >
                                {w.name}
                            </a>
                            <a
                                className="deactivate"
                                onClick={() => this.onClickDeactivateIntegration(w.id)}
                            >
                                Deactivate
                            </a>
                            <a
                                className="reconfigure"
                                onClick={() => this.onReconfigureIntegration(w.id)}
                            >
                                Reconfigure
                            </a>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const styles = {
            integrationContainer: {
                padding: '10px 0',
            },
        };

        window.parent.postMessage({
            type: 'tray_demo_size',
            height: this.calculateSize() + 'px',
        }, '*');

        return (
            <Loading loading={this.state.loadingWorkflows && this.state.loadingTemplates}>
                <div>
                    <h2 className="header">Available Integrations</h2>
                    {this.renderIntegrations()}
                </div>
                <div>
                    <h2 className="header">Active Integrations</h2>

                    {this.state.workflows && this.state.workflows.length ?
                        <p>You have authorized the following applications with <a href="#">Asana Connect</a>.</p> :
                        <p>Applications you authorize with <a href="#">Asana Connect</a> will appear here.</p>
                    }

                    {this.renderWorkflows()}
                </div>
                <div className="footer">
                    <a href="#">Manage Developer Apps</a>
                </div>
            </Loading>
        );
    }
}

export default Demo;
