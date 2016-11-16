const RateManagerGridLeftSideComponent = ({expandedClass}) => ( 
	<div className={'pinnedLeft '+ expandedClass}>
		<RateManagerGridLeftSideHeadButtonContainer/>
		 <table className='rate-calendar'>
	        <RateManagerGridLeftFirstRowContainer/>
	    </table>
		<div className='pinnedLeft-list'>
			<div className='wrapper'>
				<table className='rate-calendar'>
					<RateManagerGridLeftRowsContainer/>			
				</table>
			</div>
		</div>
	</div>
);