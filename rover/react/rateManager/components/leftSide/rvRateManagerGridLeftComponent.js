const RateManagerGridLeftSideComponent = ({expandedClass, isHierarchyHouseRestrictionEnabled}) => ( 
	<div className={'pinnedLeft '+ expandedClass}>
		<RateManagerGridLeftSideHeadButtonContainer/>
		 <div className='pinnedLeft-select'>
		 	{ 	isHierarchyHouseRestrictionEnabled &&
		 	   	<RateManagerHierarchyRestrictionsContainer/>
		 	}
		 	{ 	!isHierarchyHouseRestrictionEnabled &&
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