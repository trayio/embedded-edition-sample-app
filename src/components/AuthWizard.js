import { withTheme } from "@material-ui/core/styles/index";
import React from "react";

export class AuthWizard extends React.PureComponent {
  state = {};

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
    if (e.data.type === "tray.authPopup.error") {
      alert(`Error: ${e.data.error}`);
    }
    if (e.data.type === "tray.authpopup.close") {
      this.props.onClose();
    }
    if (e.data.type === "tray.authpopup.finish") {
      this.props.onClose();
    }
  };

  render() {
    const styles = {
      container: {
        flex: 1,
        position: "relative",
      },
      iframe: {
        width: "100%",
        height: "100%",
        minHeight: "500px",
        border: "1px solid #2196f3",
        borderRadius: "4px",
        boxSizing: "border-box",
      },
    };

    return (
      <div style={styles.container}>
        <iframe ref={this.iframe} style={styles.iframe} src={this.props.src} />
      </div>
    );
  }
}

export default withTheme()(AuthWizard);
