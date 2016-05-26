const RateManagerActivityIndicatorComponent = ({showLoader}) => (
	<div style={{display: showLoader ? 'block':'none'}} id="loading">
		<div id="loading-spinner"/>
	</div>
)