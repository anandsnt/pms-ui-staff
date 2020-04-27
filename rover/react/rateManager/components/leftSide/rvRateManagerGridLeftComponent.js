const RateManagerGridLeftSideComponent = ({hideTopHeader, hierarchyCount, hierarchyClass, panelToggleClass}) => ( 
	<div className={'pinnedLeft ' + panelToggleClass + hierarchyClass}>
		<RateManagerGridLeftSideHeadButtonContainer/>
		{
			(hierarchyCount !== 0) && !hideTopHeader &&
			<RateManagerGridLeftHierarchyHeaderContainer/>
		}
		{	(hierarchyCount === 0) &&
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