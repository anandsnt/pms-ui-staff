const RateManagerGridLeftSideComponent = () => ( 
	<div className='pinnedLeft'>
		<RateManagerGridLeftSideHeadButtonContainer/>
		<div className='pinnedLeft-list'>
			<div className='wrapper'>
				<table className='rate-calendar'>
					<RateManagerGridLeftRowsContainer/>			
				</table>
			</div>
		</div>
	</div>
);