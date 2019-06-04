import React from 'react';
import Nav from './Nav';
import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';

class View extends React.Component {

    handleLogout = () => {
        Cookies.remove('access_token');
        Cookies.remove('tray_id');
        Cookies.remove('user_uuid');

        window.location.replace("/login")
	};
	
    render() {
        const styles = {
            header: {
                backgroundColor: "#2196F3",
                padding: "12px 10px",
                color: "white",
                fontWeight: 500,
                fontSize: "1.3rem",
            },
            container: {
                backgroundColor: "#F5F5F5",
                display: "flex",
                minHeight: 500,
                paddingBottom: 40,
            },
            content: {width: "100%"},
            logout: {
                float: "right"
            },

		};
		
		let partnerName = Cookies.get('partner_name');

        return (
            <div>
                <div style={styles.header} className="App-header">
					{partnerName ? (
						<span>{partnerName}</span>
					) : (<span>OEM Demo Application</span>) }
                    
                    <Button color="inherit" style={styles.logout} onClick={this.handleLogout} to="/login">Logout</Button>
                </div>
                <div style={styles.container}>
                    <Nav/>
                    <div style={styles.content}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default withTheme()(View);
