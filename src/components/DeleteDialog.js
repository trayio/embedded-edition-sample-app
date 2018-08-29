import React from 'react';

import Loading from './Loading';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { deleteWorkflow } from '../api/workflows';

export default class DeleteDialog extends React.PureComponent {

    onCloseDialog = () => {
        this.props.onCloseDialog();
    }

    onDeleteWorkflow = () => {
        deleteWorkflow(this.props.id)
            .then(() => {
                return this.props.reload();
            })
    }

    render() {
        return (
            <Dialog
                open={this.props.visible}
                onClose={this.onCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this workflow?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={this.onDeleteWorkflow}
                        color="secondary"
                    >
                        Yes
                    </Button>
                    <Button
                        onClick={this.onCloseDialog}
                        color="primary"
                        autoFocus
                    >
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}
