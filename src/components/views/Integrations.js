import React from 'react';
import View from '../View';
import request from 'request';
import {get} from 'lodash';
import Error from '../Error';
import CircularProgress from '@material-ui/core/CircularProgress';


export class Integrations extends React.Component {

    state = {
        loading: true,
        error: false,
        templates: {},
    }

    componentDidMount() {

        request.get('http://localhost:3000/api/templates', (error, response, body) => {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log(body); // Print the HTML for the Google homepage.

            if (response.statusCode !== 200) {
                this.setState({
                    error: body,
                    loading: false,
                })
            } else {
                this.setState({
                    templates: JSON.parse(body),
                    loading: false,
                })
            }
        });
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

export default Integrations;