const RateManagerGridRightSideRowsRestrictionComponent = ({ onTdClick, mode, restrictionRows, dateList }) => (
	<tbody>
		{restrictionRows.map((rateData, rowIndex) => 
			<tr key={'key-' + rowIndex}
				className={((rowIndex + 1) === (restrictionRows.length) ? 'last' : '')}>
					
					{rateData.restrictionList.map((eachDayRestrictions, colIndex) =>
					 	<td onClick={(e) => onTdClick(e, rowIndex, index)} key={'key-' + colIndex} className='cell'>
							<div className={'cell-container ' + (dateList[colIndex].isWeekEnd ? 'weekend_day': '')}>
								<div className={'cell-content ' + (dateList[colIndex].isPastDate ? 'isHistory-cell-content': '')}>
									{eachDayRestrictions.map((restriction, restrictionIndex) => 
										<RateManagerRestrictionIconComponent
											key={'key-' + restrictionIndex}
											className={'' + restriction.className}
											text={restriction.days}/>
									)}
								</div>
							</div>
						</td>
					)}

			</tr>
		)}
	</tbody>
);