import React from 'react';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';
import Build from '@material-ui/icons/Build';

class SetupBtn extends React.Component {

    handleSetupClick = () => {
		Cookies.remove('master_token');
		Cookies.remove('css_name');
		window.location.replace("/setup")
	};

	render() {
        const styles = {
            setupBtn: {
				marginTop: 20,
				borderSize: 1,
				float: 'left',
			},
        };
        
        return (
            <Button
                style={styles.setupBtn}
                label="Register"
                onClick={this.handleSetupClick}
                color="primary"
                variant="outlined"
            >
                {<Build />}
            </Button>
        );
    }
}

export default SetupBtn;
