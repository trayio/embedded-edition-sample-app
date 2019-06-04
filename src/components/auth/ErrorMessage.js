import React from 'react';
import Typography from '@material-ui/core/Typography';
import Error from '@material-ui/icons/Error';


class ErrorMessage extends React.Component {
	render() {
		const styles = {
			errorContainer: {
				backgroundColor: '#d32f2f',
				border: '1px solid gray',
				borderRadius: '4px',
				color: 'white',
				padding: '10px',
				marginTop: '20px'
			},

			errorTitle: {
				fontSize: 'small',
				color: 'red',
			},
			errorMessage: {
				color: 'white',
				fontSize: 'small',
			},
			errorIcon: {
				fontSize: '20px',
				opacity: '0.9',
				marginRight: '8px',
				verticalAlign: 'text-top'
			}
		};

		return (
			<div>
				{this.props.message ? (
					<div style={styles.errorContainer}>
						<Typography 
							style={styles.errorMessage}
							variant="body2"
						>
							<span style={styles.errorIcon}>{<Error />}</span>
							{this.props.message}
						</Typography>
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}

export default ErrorMessage;
