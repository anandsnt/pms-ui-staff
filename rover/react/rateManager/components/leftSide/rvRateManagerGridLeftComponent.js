const RateManagerGridLeftSideComponent = () => ( 
	<div className='scrollable pinnedLeft'>
		<div className='wrapper'>
			<table className='rate-calendar'>
				<RateManagerGridLeftSideHeadButtonContainer/>
				<RateManagerGridLeftRowsContainer/>			
			</table>
		</div>
	</div>
);