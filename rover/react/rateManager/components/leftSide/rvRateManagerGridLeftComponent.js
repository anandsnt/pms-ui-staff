const RateManagerGridLeftSideComponent = ({expandedClass, hideTopHeader, hierarchyCount, hierarchyClass}) => ( 
	<div className={'pinnedLeft '+ expandedClass + hierarchyClass}>
		<RateManagerGridLeftSideHeadButtonContainer/>
		{
			(hierarchyCount !== 0) &&
			<RateManagerGridLeftHierarchyHeaderContainer/>
		}
		{	(hierarchyCount === 0) &&
			<div className='pinnedLeft-select'>
				{/* { 	isHierarchyHouseRestrictionEnabled &&
					<RateManagerHierarchyRestrictionsContainer/>
				} */}
				{ 	!hideTopHeader &&
					<RateManagerGridLeftFirstRowContainer/>
				}
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