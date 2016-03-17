const {createClass} = React

const RateManagerCalendarRightSideComponent = createClass({

	componentDidMount() {
		this.setWidth();
	},

	componentDidUpdate() {
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
					</table>
				</div>
			</div>
		);
	}
});