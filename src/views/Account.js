import React from 'react';
import View from '../components/View';
import Error from '../components/Error';
import Typography from '@material-ui/core/Typography';
import Loading from '../components/Loading';

import { me } from '../api/me';

export class Account extends React.PureComponent {

    state = {
        loading: true,
        error: false,
        email: '',
        username: '',
        userInfo: {},
    }

    componentDidMount() {
        me().then(({ok, body, statusText}) => {
            if (ok) {
                this.setState({
                    username: body.username,
                    email: body.email,
                    loading: false,
                });
            } else {
                this.setState({
                    error: statusText,
                    loading: false,
                });
            }
        });
    }

    render() {
        const style = {
            bold: {
                fontWeight: 'bold'
            },
        };

        return (
            <View>
                <Loading loading={this.state.loading}>
                    {this.state.error ?
                        <Error msg={this.state.error}/> :
                        <div>
                            <Typography variant="headline" style={{margin: "20px"}}>
                                Your Tray account
                            </Typography>
                            <div style={{padding: "10px"}}>
                                <div>
                                    <span style={style.bold}>Tray username: </span>
                                    {this.state.username}
                                </div>
                                <div>
                                    <span style={style.bold}>Tray email: </span>
                                    {this.state.email}
                                </div>
                            </div>
                        </div>
                    }
                </Loading>
            </View>
        );
    }
}

export default Account;
