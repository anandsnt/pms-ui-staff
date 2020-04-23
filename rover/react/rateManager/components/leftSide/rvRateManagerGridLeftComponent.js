const RateManagerGridLeftSideComponent = ({expandedClass, hideTopHeader, hierarchyCount, hierarchyClass, panelToggleClass}) => ( 
	<div className={'pinnedLeft '+ expandedClass + panelToggleClass + hierarchyClass}>
		<RateManagerGridLeftSideHeadButtonContainer/>
		{
			(hierarchyCount !== 0) &&
			<RateManagerGridLeftHierarchyHeaderContainer/>
		}
		{	(hierarchyCount === 0) &&
			<div className='pinnedLeft-select'>
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