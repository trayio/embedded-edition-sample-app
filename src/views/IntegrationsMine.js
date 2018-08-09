import React from 'react';
import View from '../components/View';
import Error from '../components/Error';
import Typography from '@material-ui/core/Typography';
import {withTheme} from "@material-ui/core/styles/index";
import Loading from '../components/Loading';
import Workflow from '../components/Workflow';

import { listWorkflows } from '../api/workflows';

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
        listWorkflows().then(({ok, body}) => {
            if (ok) {
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
        });
    }

    buildList(workflows) {
        return (
            <div>
                <div style={this.styles.list}>
                    <Typography variant="headline" style={{margin: "20px"}}>
                        My Integrations
                    </Typography>
                    {
                        workflows.map(({id, name, enabled}) => (
                            <Workflow
                                id={id}
                                key={id}
                                name={name}
                                enabled={enabled}
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