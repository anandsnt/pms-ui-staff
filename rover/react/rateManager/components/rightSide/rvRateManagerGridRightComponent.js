const {createClass} = React

const RateManagerGridRightSideComponent = createClass({

	componentDidMount() {
		this.setWidth();
	},

	componentDidUpdate() {
		console.log('RateManagerGridRightSideComponent update');
		this.setWidth();
	},

	setWidth() {
		var myDomNode = $(findDOMNode(this)),
			tableElement = myDomNode.find(".rate-calendar")[0],
			tableParentElement = myDomNode.find(".wrapper")[0];
		tableParentElement.style.width = tableElement.offsetWidth + 'px';
	},

	render() {
		return (
			<div id="rateViewCalendar" className='calendar-rate-table scrollable'>
				<div className='wrapper'>
					<table className='rate-calendar'>
						<RateManagerGridRightSideHeaderContainer/>
						<RateManagerGridRightSideRowsContainer/>	
					</table>
				</div>
			</div>
		);
	}
});