const RateManagerGridLeftSideComponent = ({expandedClass, isAddHierarchyRestrictions}) => ( 
	<div className={'pinnedLeft '+ expandedClass}>
		<RateManagerGridLeftSideHeadButtonContainer/>
		 <div className='pinnedLeft-select'>
		 	{ 	isAddHierarchyRestrictions &&
		 	   	<RateManagerHierarchyRestrictionsContainer/>
		 	}
		 	{ 	!isAddHierarchyRestrictions &&
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