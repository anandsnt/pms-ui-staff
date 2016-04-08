const RateManagerNoResultsFoundComponent = ({ shouldShow }) => {
	if ( !shouldShow ) {
		return <noscript></noscript>
	}
	
	return (
		<div id='rate-manager-not-configured' className='no-content'>
			<div className="info">
	            <span className="icon-no-content icon-rates"></span>
	    	    <strong className="h1">No Results</strong>
	    	    <span className="h2">Please change the selected filters and try again</span>
	        </div>
		</div>
	)
};

const { PropTypes } = React;

RateManagerNoResultsFoundComponent.propTypes = {
  shouldShow: PropTypes.bool.isRequired
}