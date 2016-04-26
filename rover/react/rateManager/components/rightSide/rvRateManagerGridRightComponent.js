const RateManagerGridRightSideHeadComponent = () => (
	<div className='calendar-rate-table calendar-rate-table-days scrollable'>
		<div className='wrapper'>
			<table className='rate-calendar'>
				<RateManagerGridRightSideHeaderContainer/>	
			</table>
		</div>
	</div>
);

const RateManagerGridRightSideComponent = () => (
	<div id="rateViewCalendar" className='calendar-rate-table calendar-rate-table-grid scrollable'>
		<div className='wrapper'>
			<table className='rate-calendar'>
				<RateManagerGridRightSideRowsContainer/>	
			</table>
		</div>
	</div>
)