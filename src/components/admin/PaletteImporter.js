import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function PaletteImporter({ onChange, palette }) {
    const [loading, setLoading] = React.useState(false);

    return (
        <TextField
            label="Import palette from URL"
            placeholder="https://www.appcues.com"
            disabled={loading}
            onKeyUp={({ target: { value }, key }) => {
                if (key !== 'Enter') {
                    return;
                }

                setLoading(true);

                fetch(`/api/palette?url=${value}`)
                    .then(res => res.json())
                    .then(res => {
                        onChange({
                            ...palette,
                            primary: {
                                main: res[0],
                                light: res[1],
                                dark: res[2],
                            },
                            secondary: {
                                main: res[3],
                                light: res[4],
                                dark: res[5],
                            },
                        });
                    })
                    .finally(() => setLoading(false));
            }}
            InputProps={{
                startAdornment: loading ? (
                    <InputAdornment position="start">
                        <CircularProgress />
                    </InputAdornment>
                ) : (
                    undefined
                ),
            }}
        />
    );
}
