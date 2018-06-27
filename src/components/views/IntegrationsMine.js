import React from 'react';
import View from '../View';
import Error from '../Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloudCircle from '@material-ui/icons/CloudCircle';
import Button from '@material-ui/core/Button';

export class MineIntegrations extends React.Component {

    state = {
        loading: true,
        error: false,
        workflows: {},
    }

    componentDidMount() {
        fetch('/api/workflows', {credentials: 'include'}).then(res =>
            res.json().then(body => {
                if (res.ok) {
                    this.setState({
                        workflows: body.data,
                        loading: false,
                    });
                } else {
                    this.setState({
                        error: body,
                        loading: false,
                    });
                }
            })
        );
    }

    onConfigure(id) {
        alert(`You clicked CONFIGURE on workflow id ${id}`);
    }

    onStop(id) {

    }

    onDelete(id) {

    }

    handleClick(id) {
        /*      fetch('/api/workflows', {
                  body: JSON.stringify({
                      id: id,
                  }),
                  headers: {
                      'content-type': 'application/json'
                  },
                  method: 'POST',
                  credentials: 'include',
              }).then(res => {
                  console.log(res);
                  res.json().then(body => {
                      window.open(body.data.popupUrl, '_blank', 'width=500,height=500,scrollbars=no')
                  })
              });*/
    }

    buildWorkflowDetails(id) {
        const styles = {
            controls: {
                marginLeft: "10px"
            },
            button: {
                width: "100%",
                marginBottom: "10px"
            }
        }

        return <ExpansionPanelDetails>

            <div id="Logs">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada
                lacus ex,
                sit amet blandit leo lobortis eget.
            </div>
            <div id="Controls" style={styles.controls}>
                <Button style={styles.button} onClick={() => this.onConfigure(id)} variant="contained"
                        color="primary">Configure</Button>
                <Button style={styles.button} onClick={() => this.onStop(id)} variant="contained"
                        color="secondary">Stop</Button>
                <Button style={styles.button} onClick={() => this.onDelete(id)} variant="contained"
                        color="secondary">Delete</Button>
            </div>

        </ExpansionPanelDetails>
    }


    buildList(templates) {
        console.log(templates);
        return (
            <div>
                <Typography variant="title">
                    My Workflows
                </Typography>
                <div>
                    <div>
                        <List>

                            {
                                templates.map(({name, id}, index) =>
                                    <ListItem key={index}>
                                        <ExpansionPanel>
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                <CloudCircle style={{paddingRight: "10px"}}/>
                                                <Typography>{name}</Typography>
                                            </ExpansionPanelSummary>
                                            {this.buildWorkflowDetails(id)}
                                        </ExpansionPanel>
                                    </ListItem>
                                )
                            }

                        </List>
                    </div>

                </div>
            </div>
        );
    }

    render() {
        let data;

        if (this.state.loading) {
            data = <CircularProgress/>;
        } else {
            data = this.state.error ?
                <Error msg={this.state.error}/> :
                this.buildList(this.state.workflows);
        }

        return (
            <View>
                {data}
            </View>
        );
    }

}

export default MineIntegrations;