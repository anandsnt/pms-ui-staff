const RateManagerGridLeftSideComponent = ({hierarchyCount, hierarchyClass, panelToggleClass, mode}) => ( 
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
		{
			(mode === RM_RX_CONST.RATE_VIEW_MODE || mode === RM_RX_CONST.RATE_TYPE_VIEW_MODE) &&
			<div className="pinnedLeft-select-container pinnedLeft-availability">
				<div className="pinnedLeft-select last">
					<div className="name">
						Available Rooms
					</div>
				</div>
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