import React from 'react';
import View from '../components/View';
import Error from '../components/Error';
import Typography from '@material-ui/core/Typography';
import { withTheme } from "@material-ui/core/styles/index";
import Loading from '../components/Loading';
import Instance from '../components/Instance';

import { listSolutionInstances } from '../api/solutions';

export class SolutionsMine extends React.PureComponent {

    styles = {
        list: {
            maxWidth: "1000px",
            margin: 'auto',
            marginBottom: '30px',
            fontFamily: "Roboto, Helvetica, Arial, sans-serif"
        }
    }

    state = {
        loading: true,
        error: false,
        solutionInstances: [],
    }

    componentDidMount() {
        this.loadAllSolutionInstances();
    }

    loadAllSolutionInstances = () => {
        listSolutionInstances()
            .then(({ok, body}) => {
                if (ok) {
                    this.setState({
                        solutionInstances: body.data,
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

    buildList(solutionInstances) {
        return (
            <div>
                <div style={this.styles.list}>
                    <Typography variant="headline" style={{margin: "20px"}}>
                        My Solution Instances
                    </Typography>
                    {
                        solutionInstances.map(({id, name, enabled}) => (
                            <Instance
                                id={id}
                                key={id}
                                name={name}
                                enabled={enabled}
                                loadAllSolutionInstances={this.loadAllSolutionInstances}
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
                        this.buildList(this.state.solutionInstances)
                    }
                </Loading>
            </View>
        );
    }

}

export default withTheme()(SolutionsMine);
