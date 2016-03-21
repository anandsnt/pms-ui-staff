const RateManagerGridRightSideRowsRestrictionListAndAmountComponent = ({ mode, amountAndRestrictions, dateList  }) => {
	return (
		<tbody>
			{amountAndRestrictions.map((amountAndRestrictionData, rowIndex) => 
				<tr key={'key-' + rowIndex}
					className={((rowIndex + 1) === (amountAndRestrictions.length) ? 'last' : '')}>
						{amountAndRestrictionData.restrictionList.map((eachDayAmountAndRestrictionData, colIndex) =>
							<td key={'key-' + colIndex} className='cell'>
								<div className={'cell-container' + (dateList[colIndex].isWeekEnd ? ' weekend_day': '') + (eachDayAmountAndRestrictionData.expanded ? ' expanded-cell' : '')}>
									<div className={'cell-content ' + (dateList[colIndex].isPastDate ? 'isHistory-cell-content': '')}>
									 		{
									 			(eachDayAmountAndRestrictionData.expanded) ? (<span/>):
									 			(<span/>)
								 			}
									</div>
								</div>
							</td>
						)}

				</tr>
			)}
		</tbody>
	);
};