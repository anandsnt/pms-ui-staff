const RateManagerGridLeftSideComponent = () => ( 
	<div className='scrollable pinnedLeft'>
		<div className='wrapper'>
			<table className='rate-calendar'>
				<RateManagerLeftSideHeadButtonContainer/>
				<RateManagerGridLeftRowsContainer/>			
			</table>
		</div>
	</div>
);