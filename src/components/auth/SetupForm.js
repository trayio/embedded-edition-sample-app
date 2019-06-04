import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { white } from '@material-ui/core/colors/';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Typography from '@material-ui/core/Typography';
import Cookies from 'js-cookie';
import {request} from '../../lib/request';
import FormHeader from './FormHeader'


class SetupForm extends React.Component {
    constructor() {
        super();
        this.state = {
            itemName: '',
            items: [],
        }
    }
    componentDidMount() {
        request('https://7e9cfeb6-9a4a-4b1f-93c1-28b0bc64b455.trayapp.io/?token=emb-demo', {method: 'GET'}, false)
            .then(async res => {
                const body = await res.json();
                this.setState({items: body});
            });
    }

    handleCssChange = (e) => {
        Cookies.set('css_name', e.target.value);
        this.setState({itemName: e.target.value});
    }

    render() {
        const {onSetup} = this.props;
        const styles = {
            field: {marginTop: 10},
            btnSpan: {marginLeft: 5},
            setupContainer: {
                backgroundColor: white,
                minWidth: 320,
                maxWidth: 400,
                height: 'auto',
                position: 'absolute',
                top: '20%',
                left: 0,
                right: 0,
                margin: 'auto',
            },
            paper: {
                padding: 20,
                overflow: 'auto'
            },
            buttonsDiv: {
                textAlign: 'center',
                padding: 10
            },
            setupBtn: {
                marginTop: 20,
                float: 'right'
            },
            setupHeader: {
                textAlign: "center",
                marginBottom: 15,
            }
        };

        return (
            <div>
                <div style={styles.setupContainer}>
                    <Paper style={styles.paper} classes={{root: 'SetupForm'}}>
                        <FormHeader 
                            title="Setup"
                        />
                        <form
                            ref={(elem) => this.form = elem}
                            onSubmit={(e) => {
                                e.preventDefault();
                                return onSetup({
                                    token: this.tokenElem.value,
                                    partner: this.partnerElem.value,
                                });
                            }}
                        >
                            <Input
                                inputRef={(input) => this.tokenElem = input}
                                label="Master token"
                                placeholder="token"
                                fullWidth={true}
                                defaultValue={Cookies.get('master_token')}
                            />

                            <Input
                                inputRef={(input) => this.partnerElem = input}
                                label="Partner name"
                                style={{marginTop: 10}}
                                placeholder="partner"
                                fullWidth={true}
                                defaultValue={Cookies.get('partner')}
                            />

                            <Select
                                style={{width: '100%', marginTop: 10}}
                                placeholder="Add custom stylesheet"
                                onChange={this.handleCssChange}
                                value={this.state.itemName}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {this.state.items.map(name => 
                                    <MenuItem key={name} value={name}>{name}</MenuItem>
                                )}
                            </Select>

                            <a
                                style={{display: 'block', marginTop: 20, fontSize: 12, color: '#2196f3'}}
                                href="https://a28d8d06-7dbe-4f5e-9880-3caea03e0483.trayapp.io/">
                                    Use this form to upload CSS
                                </a>

                            <Button
                                style={styles.setupBtn}
                                variant="outlined"
                                color="primary"
                                type='submit'
                            >
                                Complete Setup
                            </Button>

                        </form>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default SetupForm;
