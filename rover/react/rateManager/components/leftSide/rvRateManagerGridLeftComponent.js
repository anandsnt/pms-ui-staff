const RateManagerGridLeftSideComponent = ({expandedClass, isHierarchyHouseRestrictionEnabled, showGridLeftFirstRowComponent}) => ( 
	<div className={'pinnedLeft '+ expandedClass}>
		<RateManagerGridLeftSideHeadButtonContainer/>
		{
			isHierarchyHouseRestrictionEnabled &&
			<div className='pinnedLeft-select'>
				<RateManagerHierarchyRestrictionsContainer/>
			</div>
		}
		{
			showGridLeftFirstRowComponent &&
			<div className='pinnedLeft-select'>
				<RateManagerGridLeftFirstRowContainer/>
			</div>
		}
		<div className='pinnedLeft-list'>
			<div className='wrapper'>
				<table className='rate-calendar'>
					<RateManagerGridLeftRowsContainer/>			
				</table>
			</div>
		</div>
	</div>
);