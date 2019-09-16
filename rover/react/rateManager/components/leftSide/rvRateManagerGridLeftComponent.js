const RateManagerGridLeftSideComponent = ({expandedClass, isHierarchyRestrictionEnabled}) => ( 
	<div className={'pinnedLeft '+ expandedClass}>
		<RateManagerGridLeftSideHeadButtonContainer/>
		 <div className='pinnedLeft-select'>
		 	{ 	isHierarchyRestrictionEnabled &&
		 	   	<RateManagerHierarchyRestrictionsContainer/>
		 	}
		 	{ 	!isHierarchyRestrictionEnabled &&
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