import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

class Loading extends React.Component {
    render() {
        const styles = {
            container: {
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }
        };

        const spinner = (
            <div style={styles.container}>
                <CircularProgress/>
            </div>
        );

        return this.props.loading ? spinner : this.props.children;
    }
}

export default Loading;
