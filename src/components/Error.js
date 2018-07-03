import React from 'react';
import {withTheme} from '@material-ui/core/styles';

const styles = {
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "crimson",
        padding: '0 20px',
    }
};

const Error = ({msg}) => (
    <div style={styles.container}>
        <div>{JSON.stringify(msg, null, 4)}</div>
    </div>
);

export default withTheme()(Error);