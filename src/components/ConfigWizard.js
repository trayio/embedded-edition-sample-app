import {withTheme} from "@material-ui/core/styles/index";
import React from 'react';

export class ConfigWizard extends React.PureComponent {

    constructor(props) {
        super(props);
        this.iframe = React.createRef();
    }

    componentDidMount() {
        window.addEventListener("message", this.handleIframeEvents);
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.handleIframeEvents);
    }

    handleIframeEvents = (e) => {
        // Here we should handle all event types
        if (e.data.type === 'tray.configPopup.error') {
            alert(`Error: ${e.data.err}`);
        }
        if (e.data.type === 'tray.configPopup.cancel') {
            this.props.onClose();
        }
        if (e.data.type === 'tray.configPopup.finish') {
            this.props.onClose();
        }
    };

    render() {
        const styles = {
            container: {
                flex: 1
            },
            iframe: {
                width: '100%',
                height: '100%',
                minHeight: '500px',
                border: 'none',
            },
        };

        return (
            <div style={styles.container}>
                <iframe ref={this.iframe} style={styles.iframe} src={this.props.src}/>
            </div>
        )
    }

}

export default withTheme()(ConfigWizard);
