import React from 'react';
import View from '../components/View';
import Loading from '../components/Loading';
import Error from '../components/Error';

export class Overview extends React.PureComponent {

    state = {
        loading: true,
        error: false,
        code: null,
    }

    getCode = () => fetch('/api/overview', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json()
        }))

    componentDidMount() {
        this.getCode()
        .then(({ok, body}) => {
            if (ok) {
                this.setState({
                    iframeSrc: body.data.iframeSrc,
                    loading: false,
                });
            } else {
                this.setState({
                    error: body,
                    loading: false,
                });
            }
        });
    }

    render() {

        const styles = {
            container: {
                flex: 1,
                height: '100%'
            },
            iframe: {
                width: '100%',
                height: '100%',
                minHeight: '500px',
                border: 0,
                display: 'block'
            },
        };

        return (
            <View>
                <Loading loading={this.state.loading}>
                    {
                        this.state.error ?
                            <Error msg={this.state.error}/> :
                            <div style={styles.container}>
                                <iframe
                                    style={styles.iframe}
                                    src= {this.state.iframeSrc}
                                    title="Embedded Widget"
                                />
                            </div>
                    }
                </Loading>
            </View>
        );
    }

}


export default Overview;