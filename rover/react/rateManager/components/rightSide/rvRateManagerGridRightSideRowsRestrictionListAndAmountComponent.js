const RateManagerGridRightSideRowsRestrictionListAndAmountComponent = ({ onTdClick, mode, roomTypeRowsData, dateList  }) => (
	<tbody>
		{roomTypeRowsData.map((rowData, rowIndex) => 
			<tr key={'key-' + rowIndex}
				className={((rowIndex + 1) === (roomTypeRowsData.length) ? 'last' : '')}>
					{rowData.restrictionList.map((eachDayRestrictionData, colIndex) =>
						<td key={'key-' + colIndex} onClick={(e) => onTdClick(e, rowIndex, colIndex)} className='cell'>
							<div className={'cell-container' + (dateList[colIndex].isWeekEnd ? ' weekend_day': '') + (rowData.expanded ? ' expanded-cell' : '')}>
						 			{rowIndex === 0 ? 
						 				(
						 					<div className={'cell-content ' + (dateList[colIndex].isPastDate ? 'isHistory-cell-content': '')}>
											   {eachDayRestrictionData.map((restriction, restrictionIndex) => 
													<RateManagerRestrictionIconComponent
														key={'key-' + restrictionIndex}
														className={'right ' + restriction.className}
														text={restriction.days}/>
												)}
							 				</div>
							 			)
							 			:
							 			(

								 			(rowData.expanded) ? 
								 			(
								 				<div className={'cell-content ' + (dateList[colIndex].isPastDate ? 'isHistory-cell-content': '')}>
								 					<div className="restriction_holder">
													   {eachDayRestrictionData.map((restriction, restrictionIndex) => 
															<RateManagerRestrictionIconComponent
																key={'key-' + restrictionIndex}
																className={'right ' + restriction.className}
																text={restriction.days}/>
														)}
													</div>

													<div className="room-type-price">
														<span className="room-type-price-name">
															Single
														</span>
														<span className={'room-type-price-value' + (rowData.rateDetails[colIndex].single_overridden ? ' has-override':'')}>
									 						{rowData.rateDetails[colIndex].single}
									 						<span className={"icon-report icon-upsell" + (rowData.rateDetails[colIndex].single_overridden ? '':' hidden')}/>
									 					</span>
													</div>
													<div className="room-type-price">
														<span className="room-type-price-name">
															Double
														</span>
														<span className={'room-type-price-value' + (rowData.rateDetails[colIndex].double_overridden ? ' has-override':'')}>
									 						{rowData.rateDetails[colIndex].double}
									 						<span className={"icon-report icon-upsell" + (rowData.rateDetails[colIndex].double_overridden ? '':' hidden')}/>
									 					</span>
													</div>											
													<div className="room-type-price">
														<span className="room-type-price-name">
															Extra Adult
														</span>
														<span className={'room-type-price-value' + (rowData.rateDetails[colIndex].extra_adult_overridden ? ' has-override':'')}>
									 						{rowData.rateDetails[colIndex].extra_adult}
									 						<span className={"icon-report icon-upsell" + (rowData.rateDetails[colIndex].extra_adult_overridden ? '':' hidden')}/>
									 					</span>
													</div>
													<div className="room-type-price">
														<span className="room-type-price-name">
															Child
														</span>
														<span className={'room-type-price-value' + (rowData.rateDetails[colIndex].child_overridden ? ' has-override':'')}>
									 						{rowData.rateDetails[colIndex].child}
									 						<span className={"icon-report icon-upsell" + (rowData.rateDetails[colIndex].child_overridden ? '':' hidden')}/>
									 					</span>
													</div>																					
								 				</div>
								 			)
								 			:
								 			(
							 					<div className={'cell-content ' + (dateList[colIndex].isPastDate ? 'isHistory-cell-content': '')}>
							 						
								 					<span 
								 						className=
								 							{'rate-single' + 
									 							(
									 								(
									 									rowData.rateDetails[colIndex].single_overridden ||
									 									rowData.rateDetails[colIndex].child_overridden ||
									 									rowData.rateDetails[colIndex].extra_adult_overridden ||
									 									rowData.rateDetails[colIndex].double_overridden 
									 								) ? 
									 								' has-override': '' 
									 							)
								 							}
								 						 >
								 						{rowData.rateDetails[colIndex].single}
								 						<span className={
								 							"icon-report icon-upsell" + 
								 							(
								 								(
								 									rowData.rateDetails[colIndex].single_overridden ||
								 									rowData.rateDetails[colIndex].child_overridden ||
								 									rowData.rateDetails[colIndex].extra_adult_overridden ||
								 									rowData.rateDetails[colIndex].double_overridden 
								 								) ? 
								 								'' :' hidden'
								 							)
								 						}/>
								 					</span>
								 					<div className="restriction_holder">
													   {eachDayRestrictionData.map((restriction, restrictionIndex) => 
															<RateManagerRestrictionIconComponent
																key={'key-' + restrictionIndex}
																className={'right ' + restriction.className}
																text={restriction.days}/>
														)}
													</div>
								 				</div>					
								 			)
								 		)
					 			}
								
							</div>
						</td>
					)}

			</tr>
		)}
	</tbody>
);