import React from 'react';
import Loading from '../components/Loading';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Update to use Solutions
import { openConfigWindow } from '../lib/configWindow';
// Add ability to remove solution instance
import {
    listSolutions,
    listSolutionInstances,
    createSolutionInstance,
    deleteSolutionInstance,
    updateSolutionInstanceConfig,
} from '../api/solutions';

import './demo.css';

import config from '../config.js';

export class Demo extends React.PureComponent {
    containerRef = React.createRef(null);
    observingSize = false;

    state = {
        solutions: null,
        instances: null,
        loadinginstances: true,
        loadingSolutions: true,
        entitiesToSkip: {},
    }

    componentDidMount() {
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username: config.username,
                password: config.password,
            }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            this.listSolutions();
            this.listInstances();
        });
    }

    componentDidUpdate() {
        if(this.containerRef.current && !this.observingSize) {
            new ResizeObserver(([entry]) => {
                window.parent.postMessage({
                    type: 'tray_demo_size',
                    height: entry.contentRect.height + 'px',
                }, '*');
            }).observe(this.containerRef.current);
            this.observingSize = true;
        }
    }

    listSolutions = () => {
        listSolutions().then(({body}) => {
            this.setState({solutions: body.data, loadingSolutions: false});
        });
    }

    listInstances = () => {
        listSolutionInstances().then(({body}) => {
            this.setState({instances: body.data, loadinginstances: false});
        });
    }

    onClickActivateIntegration = (id, title) => {
        const configWindow = openConfigWindow();

        createSolutionInstance(id, title).then(({body}) => {
            // After we generate the popup URL, set it to the previously opened
            // window:
            configWindow.location = body.data.popupUrl;
            this.listInstances();
        });
    }

    onClickDeactivateIntegration = id => {
        deleteSolutionInstance(id).then(this.listInstances);
    }

    onReconfigureIntegration = id => {
        const configWindow = openConfigWindow();

        updateSolutionInstanceConfig(id).then(({body}) => {
            // After we generate the popup URL, set it to the previously opened
            // window:
            configWindow.location = body.data.popupUrl;
        });
    }

    renderSolutions() {
        return (
            this.state.solutions &&
            this.state.solutions.map(i => {
                const imgUrl = i.customFields.find(customField => customField.key === 'imgUrl');

                return (
                    <GridItem
                        title={i.title}
                        image={imgUrl ? imgUrl.value : undefined}
                        onClick={() => this.onClickActivateIntegration(i.id, i.title)}
                    />
                );
            })
        );
    }

    renderInstances() {
        if (!this.state.instances || !this.state.instances.length) return null;

        return this.state.instances.map(w => {
            const imgUrl = w.solution.customFields.find(customField => customField.key === 'imgUrl');

            return (
                <GridItem
                    title={w.name}
                    image={imgUrl ? imgUrl.value : undefined}
                    onClick={() => this.onReconfigureIntegration(w.id)}
                />
            );
        });
    }


    render() {
        return (
            <Loading loading={this.state.loadinginstances && this.state.loadingSolutions}>
                <div className="demo-container" ref={this.containerRef}>
                    <Typography variant="display1">Available Integrations</Typography>
                    <div className="demo-grid">
                        {this.renderSolutions()}
                    </div>
                    <Typography variant="display1">Active integrations</Typography>
                    <div className="demo-grid">
                        {this.renderInstances()}
                    </div>
                </div>
            </Loading>
        );
    }
}

export default Demo;

function GridItem({ title, onClick, image = '//s3.amazonaws.com/images.tray.io/artisan/icons/slack.png' }) {
    const [raised, setRaised] = React.useState(false);

    const handleMouseOver = React.useCallback(() => {
        setRaised(true);
    }, []);

    const handleMouseOut = React.useCallback(() => {
        setRaised(false);
    }, []);

    return (
        <Card
            className="demo-grid-item"
            raised={raised}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={onClick}
        >
            <CardContent className="demo-grid-item-content">
                <img src={image} className="demo-grid-item-content-img" />
                <div className="demo-grid-item-content-title">{title}</div>
            </CardContent>
        </Card>
    );
}



// FONT from parent window
// Size with resizeObserver
// 