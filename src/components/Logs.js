import React from 'react';
import {withTheme} from "@material-ui/core/styles/index";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SuccessIcon from '@material-ui/icons/Done';
import FailIcon from '@material-ui/icons/Clear';
import {get} from 'lodash';

export class Logs extends React.Component {

    state = {
        loading: true,
        error: false,
        deleteWorkflow: false,
        workflows: {},
    }

    buildResultItem(node, index) {
        const success = node.currentState === 'successful';
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

        const edges = entries.edges;

        const data = edges.length < 1 ?
            <div> No results yet</div> :
            <List>
                {edges.map((e, index) => this.buildResultItem(e.node, index))}
            </List>

        return (
            <div>
                <h3>Logs</h3>
                {data}
            </div>
        );
    }

}

export default withTheme()(Logs);