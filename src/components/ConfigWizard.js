import {withTheme} from "@material-ui/core/styles/index";
import React from 'react';

export class ConfigWizard extends React.PureComponent {
    state = {
        ready: false,
    };

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
        console.log(`${e.data.type} event received`);
        // Here we should handle all event types
        if (e.data.type === 'tray.configPopup.error') {
            alert(`Error: ${e.data.err}`);
        }
        if (e.data.type === 'tray.configPopup.cancel') {
            this.props.onClose();
        }
        if (e.data.type === 'tray.configPopup.ready') {
            this.setState({ ready: true });
        }
        if (e.data.type === 'tray.configPopup.finish') {
            this.props.onClose();
        }
    };

    render() {
        const styles = {
            container: {
                flex: 1,
                position: 'relative',
            },
            iframe: {
                width: '100%',
                height: '100%',
                minHeight: '500px',
                border: '1px solid #2196f3',
                borderRadius: '4px',
                boxSizing: 'border-box',
            },
            loadingScreen: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'absolute',
                background: 'white',
                border: '1px solid #2196f3',
                borderRadius: '4px',
            }
        };

        return (
            <div style={styles.container}>
                <iframe
                    ref={this.iframe}
                    style={styles.iframe}
                    src={this.props.src}
                    title="Solution instance configurator"
                />
                {!this.state.ready && <div style={styles.loadingScreen}>Loading...</div>}
            </div>
        )
    }

}

export default withTheme()(ConfigWizard);
