import React from 'react';
import View from '../View';
import {get} from 'lodash';
import Error from '../Error';
import Typography from '@material-ui/core/Typography';
import Loading from '../Loading';

export class Account extends React.PureComponent {

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
        const style = {
            bold: {
                fontWeight: 'bold'
            }
        }

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
