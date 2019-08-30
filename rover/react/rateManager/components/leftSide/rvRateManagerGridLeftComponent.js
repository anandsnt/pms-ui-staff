const RateManagerGridLeftSideComponent = ({expandedClass, isAddHierarchyRestrictions}) => ( 
	<div className={'pinnedLeft '+ expandedClass}>
		<RateManagerGridLeftSideHeadButtonContainer/>
		 <table className='rate-calendar'>
		 	{ isAddHierarchyRestrictions &&
		 	   <h2>isAddHierarchyRestrictions</h2>
		 	}
		 	{!isAddHierarchyRestrictions &&
	        	<RateManagerGridLeftFirstRowContainer/>
	    	}
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