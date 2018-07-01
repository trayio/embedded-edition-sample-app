import React from 'react';
import View from '../View';
import {get} from 'lodash';
import Error from '../Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

export class Account extends React.Component {

    state = {
        loading: true,
        error: false,
        email: '',
        username: '',
        userInfo: {},
    }

    componentDidMount() {

        fetch('/api/me', {credentials: 'include'}).then(res =>
            res.json().then(body => {
                    console.log(body);
                    if (res.ok) {
                        this.setState({
                            username: body.username,
                            email: body.email,
                            loading: false,
                        });
                    } else {
                        this.setState({
                            error: res.statusText,
                            loading: false,
                        });
                    }
                }
            )
        );
    }

    render() {
        let data;
        if (this.state.loading) {
            data = <CircularProgress/>;
        } else {
            const bold = {fontWeight: 'bold'};
            data = this.state.error ?
                <Error msg={this.state.error}/> :
                <div>
                    <Typography variant="headline" style={{margin: "20px"}}>
                        Your Tray account
                    </Typography>
                    <div style={{padding: "10px"}}>
                        <div>
                            <span style={bold}>Tray username: </span>
                            {this.state.username}
                        </div>
                        <div>
                            <span style={bold}>Tray email: </span>
                            {this.state.email}
                        </div>
                    </div>
                </div>
        }

        return (
            <View>
                {data}
            </View>
        );
    }
}

export default Account;
