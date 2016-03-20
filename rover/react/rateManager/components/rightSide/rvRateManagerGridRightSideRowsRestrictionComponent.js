const _RateManagerGridRightSideRowsRestrictionComponent = ({ mode, restrictionRows }) => {
	if(mode !== RM_RX_CONST.RATE_VIEW_MODE 
		&& mode !== RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
		return false
	}
	return (
		<tbody>
			{restrictionRows.map((rateData, rowIndex) => 
				<tr key={'key-' + rowIndex}
					className={((rowIndex + 1) === (restrictionRows.length) ? 'last' : '')}>
						
						{rateData.restrictionList.map((eachDayRestrictions, colIndex) =>
						 	<RateManagerGridRightSideCellComponent key={'key-' + colIndex}>
								{eachDayRestrictions.map((restriction, restrictionIndex) => 
									<RateManagerRestrictionIconComponent
										key={'key-' + restrictionIndex}
										className={'' + restriction.className}
										text={restriction.days}/>
								)}
							</RateManagerGridRightSideCellComponent>
						)}

				</tr>
			)}
		</tbody>
	);
};

//mixins
const RateManagerGridRightSideRowsRestrictionComponent = 
	RateManagerGridRightSideRowsCommonComponent(_RateManagerGridRightSideRowsRestrictionComponent);
