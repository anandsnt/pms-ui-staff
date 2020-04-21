const RateManagerGridLeftSideComponent = ({isHierarchyHouseRestrictionEnabled, hideTopHeader}) => ( 
	<div className='pinnedLeft'>
		<RateManagerGridLeftSideHeadButtonContainer/>
		 <div className='pinnedLeft-select'>
		 	{ 	isHierarchyHouseRestrictionEnabled &&
		 	   	<RateManagerHierarchyRestrictionsContainer/>
		 	}
		 	{ 	!hideTopHeader &&
	        	<RateManagerGridLeftFirstRowContainer/>
	    	}
	    </div>
		<div className='pinnedLeft-list'>
			<div className='wrapper'>
				<table className='rate-calendar'>
					<RateManagerGridLeftRowsContainer/>			
				</table>
			</div>
		</div>
	</div>
);