import * as React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import AdminPanel from './AdminPanel';

export default ({ children }) => {
    const [palette, setPalette] = React.useState({
        type: 'light',
        primary: blue,
    });

    const theme = React.useMemo(() => createMuiTheme({ palette }), [palette]);

    return (
        <MuiThemeProvider theme={theme}>
            {children}
            <AdminPanel onChange={setPalette} palette={theme.palette} />
        </MuiThemeProvider>
    );
};
