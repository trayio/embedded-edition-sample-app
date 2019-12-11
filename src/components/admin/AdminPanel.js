import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PaletteImporter from './PaletteImporter';
import PaletteEditor from './PaletteEditor';

export default function AdminPanel({ onChange, palette }) {
    return (
        <Card style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 300 }}>
            <CardContent>
                <PaletteImporter onChange={onChange} palette={palette} />
                <PaletteEditor onChange={onChange} palette={palette} />
            </CardContent>
        </Card>
    );
}
