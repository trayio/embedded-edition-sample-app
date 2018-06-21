import React from 'react';
import View from '../View';
import {get} from 'lodash';
import Error from '../Error';
import CircularProgress from '@material-ui/core/CircularProgress';

export class IntegrationsMine extends React.Component {

    state = {
        loading: true,
        error: false,
        templates: {},
    }

    componentDidMount() {
        fetch('/api/templates', {credentials: 'include'}).then(res =>
            res.json().then(body => {
                if (res.ok) {
                    this.setState({
                        templates: body,
                        loading: false,
                    });

                } else {
                    this.setState({
                        error: body,
                        loading: false,
                    })
                }

            })
        );
    }

    render() {
        let data;
        if (this.state.loading) {
            data = <CircularProgress/>;
        } else {
            data = this.state.error ? <Error msg={this.state.error}/> :
                <div>
                    <ul>
                        <li>{get(this.state, 'templates.data.viewer.templates.edges').map(e => e.node.title)}></li>
                    </ul>
                </div>
        }
        return (
            <View>
                {data}
            </View>
        )
    }

}

export default IntegrationsMine;