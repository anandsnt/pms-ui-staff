const RateManagerNotConfiguredComponent = ({ shouldShow }) => {
	if ( !shouldShow ) {
		return <span style={{display:'none'}}/>; /* TODO: check alternative ways */
	}
	
	return (
		<div id='rate-manager-not-configured' className='no-content'>
			<div className="info">
	            <span className="icon-no-content icon-rates"></span>
	    	    <strong className="h1">Rate Manager not configured</strong>
	    	    <span className="h2">Please select filter options to begin</span>
	        </div>
		</div>
	)
};

const { PropTypes } = React;

RateManagerNotConfiguredComponent.propTypes = {
  shouldShow: PropTypes.bool.isRequired
}