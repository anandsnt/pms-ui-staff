const { Component } = React;
const { findDOMNode } = ReactDOM;

const RateManagerRootComponent = () => (		
	<div className='calendar'>
		<RateManagerNotConfiguredContainer/>
		<RateManagerGridViewRootContainer/>
	</div>
);
