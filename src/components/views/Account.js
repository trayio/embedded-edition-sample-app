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
        request.get('http://localhost:3000/api/me', (error, response, body) => {
            if (response.statusCode !== 200) {
                this.setState({
                    error: body,
                    loading: false,
                });
            } else {
                this.setState({
                    userInfo: JSON.parse(body),
                    loading: false,
                });
            }
        });
    }

    render() {
        let data;
        if (this.state.loading) {
            data = <CircularProgress/>;
        } else {
            data = this.state.error ?
                <Error msg={this.state.error}/> :
                <div>{get(this.state, 'userInfo.data.viewer.details.username')}</div>;
        }

        return (
            <View>
                {data}
            </View>
        );
    }
}

export default Account;
