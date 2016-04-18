const RateManagerGridRightSideRowsRestrictionComponent = ({ onTdClick, mode, restrictionRows, dateList }) => (
	<tbody>
		{restrictionRows.map((rateData, rowIndex) => 
			<tr key={'key-' + rowIndex}
				className={((rowIndex + 1) === (restrictionRows.length) ? 'last' : '')}>
					
					{rateData.restrictionList.map((eachDayRestrictions, colIndex) =>
					 	<td onClick={(e) => onTdClick(e, rowIndex, colIndex)} key={'key-' + colIndex} className='cell'>
							<div className={'cell-container ' + (dateList[colIndex].isWeekEnd ? 'weekend_day': '')}>
									{ rowIndex > 0 ? (
										<div className={'cell-content ' + (dateList[colIndex].isPastDate ? 'isHistory-cell-content': '')}>
											<RateManagerCellsRateComponent
												amount={rateData.amount}/>
											<div className='restriction_holder'>
												{eachDayRestrictions.map((restriction, restrictionIndex) => 
													<RateManagerRestrictionIconComponent
														key={'key-' + restrictionIndex}
														className={'' + restriction.className}
														text={restriction.days}/>
												)}
											</div>
										</div>
									 ) : (
									 		<div className={'cell-content ' + (dateList[colIndex].isPastDate ? 'isHistory-cell-content': '')}>
									 			{eachDayRestrictions.map((restriction, restrictionIndex) => 
													<RateManagerRestrictionIconComponent
														key={'key-' + restrictionIndex}
														className={'' + restriction.className}
														text={restriction.days}/>
												)}
									 		</div>
									 ) }
								</div>
						</td>
					)}
			</tr>
		)}
	</tbody>
);

const RateManagerCellsRateComponent = ({amount}) => (
	<span className={'rate-single ' + (amount === null ? 'no-rate' : '')}>
		{amount === null ? null : (<span className="rate-single-text">From</span>)}
		{amount === null ? 'NO RATE' : amount}
	</span>	
);