import React from 'react';
import {withTheme} from '@material-ui/core/styles';

const Error = ({msg}) => (
    <div>
        <div style={{border: "thick red solid", color: "red", display: "flex",}}>
            <div>
                Error: {msg}
            </div>
        </div>
    </div>
);

export default withTheme()(Error);