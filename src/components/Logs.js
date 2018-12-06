import React from 'react';
import { withTheme } from "@material-ui/core/styles/index";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SuccessIcon from '@material-ui/icons/Done';
import FailIcon from '@material-ui/icons/Clear';
import { get } from 'lodash';
import Loading from './Loading';

export class Logs extends React.PureComponent {

    state = {
        loading: true,
        error: false,
        deleteWorkflow: false,
        workflows: {},
    }

    buildResultItem(node, index) {
        const success = node.currentState.toLowerCase() === 'successful';
        const time = new Date(node.created).toUTCString();
        const icon = success ? <SuccessIcon style={{color: "green"}}/> : <FailIcon style={{color: "red"}}/>;
        const title = success ? "Successful Run" : "Failed Run"

        return (
            <ListItem key={`res${index}`}>
                {icon}<span style={{fontWeight: "bold"}}>{title}</span>: {time}
            </ListItem>
        );
    }

    render() {
        const {entries} = this.props;

        const data = get(entries, 'length', 0) < 1 ?
            <div>No results yet</div> :
            <List>
                {entries.map(this.buildResultItem)}
            </List>

        return (
            <Loading loading={this.props.loading}>
                <h3>Logs</h3>
                {data}
            </Loading>
        );
    }

}

export default withTheme()(Logs);