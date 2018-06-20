import React from 'react';
import View from '../View';
import request from 'request';
import {get} from 'lodash';
import Error from '../Error';
import CircularProgress from '@material-ui/core/CircularProgress';

export class Account extends React.Component {

    state = {
        loading: true,
        error: false,
        userInfo: {},
    }

    componentDidMount() {

        request.get('http://localhost:3000/api/account', (error, response, body) => {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.

            if (response.statusCode !== 200) {
                this.setState({
                    error: body,
                    loading: false,
                })
            } else {
                this.setState({
                    userInfo: JSON.parse(body),
                    loading: false,
                })
            }
        });
    }

    render() {
        let data;
        if (this.state.loading) {
            data =   <CircularProgress/>;
        } else {
            data = this.state.error ? <Error msg={this.state.error}/> : <div>{get(this.state, 'userInfo.data.viewer.details.email')}</div>
        }
        return (
            <View>
                {data}
            </View>
        )
    }
}

export default Account;