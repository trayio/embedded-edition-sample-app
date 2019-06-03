import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { white } from '@material-ui/core/colors/';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

class SetupForm extends React.Component {
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
                    <Paper style={styles.paper}>
                        <Typography
                            style={styles.setupHeader}
                            variant="headline"
                        >
                            Setup the OEM demo app
                        </Typography>
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
                            />

                            <Input
                                inputRef={(input) => this.partnerElem = input}
                                label="Partner name"
                                style={{marginTop: 10}}
                                placeholder="partner"
                                fullWidth={true}
                            />

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
