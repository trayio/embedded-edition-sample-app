import * as React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { SketchPicker } from 'react-color';

export default function PaletteEditor({ onChange, palette }) {
    const onChangeFactory = React.useCallback(
        key => newColors => {
            onChange({ ...palette, [key]: newColors });
        },
        [onChange, palette]
    );

    return (
        <List component="nav">
            <ListItem divider>
                <ListItemText
                    primary="Primary colors"
                    secondary={<PaletteColorsEditor onChange={onChangeFactory('primary')} colors={palette.primary} />}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Secondary colors"
                    secondary={
                        <PaletteColorsEditor onChange={onChangeFactory('secondary')} colors={palette.secondary} />
                    }
                />
            </ListItem>
        </List>
    );
}

function PaletteColorsEditor({ onChange, colors }) {
    const onChangeFactory = React.useCallback(
        key => newColor => {
            onChange({ ...colors, [key]: newColor });
        },
        [onChange, colors]
    );

    return (
        <div>
            <ColorEditor onChange={onChangeFactory('main')} title="Main" color={colors.main} />
            <ColorEditor onChange={onChangeFactory('light')} title="Light" color={colors.light} />
            <ColorEditor onChange={onChangeFactory('dark')} title="Dark" color={colors.dark} />
        </div>
    );
}

function ColorEditor({ onChange, title, color }) {
    const [isEditingColor, setEditingColor] = React.useState(false);
    return (
        <div style={{ display: 'relative', cursor: 'pointer' }}>
            <span onClick={() => setEditingColor(wasEditingColor => !wasEditingColor)}>{title}</span>
            <span style={{ display: 'inline-block', backgroundColor: color, width: 16, height: 16 }} />
            {isEditingColor && (
                <>
                    <div
                        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, top: 0 }}
                        onClick={() => setEditingColor(false)}
                    />
                    <div style={{ display: 'absolute', bottom: 0, left: 0 }}>
                        <SketchPicker color={color} onChangeComplete={({ hex }) => onChange(hex)} />
                    </div>
                </>
            )}
        </div>
    );
}
