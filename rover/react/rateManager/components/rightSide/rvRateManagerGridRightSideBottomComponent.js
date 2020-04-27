const RateManagerGridRightSideBottomComponent = ({hierarchyRestrictionClass}) => (
	<div id="rateViewCalendar" className={'calendar-rate-table calendar-rate-table-grid scrollable ' + hierarchyRestrictionClass}>
		<div className='wrapper'>
			<table className='rate-calendar'>
				<RateManagerGridRightSideRowsContainer/>	
			</table>
		</div>
	</div>
)