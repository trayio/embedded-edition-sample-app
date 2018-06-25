import React from 'react';
import {withTheme} from '@material-ui/core/styles';

const Error = ({msg}) => (
    <div>
        <div style={{border: "thick red solid", color: "red", display: "flex",}}>
            <div>
                Error: {JSON.stringify(msg, null, 4)}
            </div>
        </div>
    </div>
);

export default withTheme()(Error);