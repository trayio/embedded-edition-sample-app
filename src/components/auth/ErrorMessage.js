import React from 'react';

class ErrorMessage extends React.Component {
	render() {
		return (
			<div>
				{this.props.message ? (
					<div>
						<h3
							style={{
								color: 'red',
								textAlign: 'center',
							}}
						>
							{this.props.title}
						</h3>
						<h4 style={{ textAlign: 'center' }}>
							{this.props.message}
						</h4>
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}

export default ErrorMessage;
