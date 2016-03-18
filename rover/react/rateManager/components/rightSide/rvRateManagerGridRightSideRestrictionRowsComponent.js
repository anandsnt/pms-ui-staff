const RateManagerGridRightSideRestrictionRowsComponent = ({ restrictionRows, mode }) => (
	<tbody>
		{restrictionRows.map((rateData, rowIndex) => {
			return (
				<tr key={'key-' + rowIndex}>
					{rateData.restrictionList.map((eachDayRestrictions, colIndex) =>{
						return (
							<td key={'key-' + colIndex} className='cell'>
								<div className='cell-container'>
									<div className='cell-content'>
									{eachDayRestrictions.map((restriction, restrictionIndex) => 
										<RateManagerRestrictionIconComponent  key={'key-' + restrictionIndex}
											className={'' + restriction.className}
											text={restriction.days}/>
									)}
									</div>
								</div>
							</td>
						)
					})}		
				</tr>
		)}
		)}
	</tbody>
)
