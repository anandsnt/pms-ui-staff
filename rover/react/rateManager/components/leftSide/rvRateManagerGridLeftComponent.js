const RateManagerGridLeftSideComponent = ({hierarchyCount, hierarchyClass, panelToggleClass}) => ( 
	<div className={'pinnedLeft ' + panelToggleClass + hierarchyClass}>
		<RateManagerGridLeftSideHeadButtonContainer/>
		{
			(hierarchyCount !== 0) &&
			<RateManagerGridLeftHierarchyHeaderContainer/>
		}
		{	(hierarchyCount === 0) &&
			<div className='pinnedLeft-select last'>
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