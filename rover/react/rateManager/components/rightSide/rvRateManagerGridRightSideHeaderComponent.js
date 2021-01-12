const { createClass } = React
const { findDOMNode } = ReactDOM

const RateManagerGridRightSideHeaderComponent = createClass({
	componentDidMount() {
		this.setWidth();
	},

	componentDidUpdate() {
		this.setWidth();
	},

	setWidth() {
		var myDomNode = $(findDOMNode(this)),
			tableParentElement = myDomNode.find(".wrapper")[0],
			tableElement = myDomNode.find(".rate-calendar")[0];

		tableParentElement.style.width = tableElement.offsetWidth + 'px';
	},
	render() {
		return (
			<div className='calendar-rate-table calendar-rate-table-days scrollable'>
				<div className='wrapper'>
					<table className='rate-calendar'>
						<thead>
							<tr className="cell">
								{this.props.headerDataList.map( (headerData, index) =>
									<th className={headerData.headerClass} key={"header-data-" + index}>
										{
											headerData.eventCount !== 0 && <div onClick={() => this.props.onDailyEventCountClick(headerData.date)} data-events={headerData.eventCount} className="has-event-block border">
												<div className={headerData.cellClass}>
													<span className={headerData.topLabelContainerClass}>
														{headerData.topLabel}
													</span>
													<span className={headerData.bottomLabelContainerClass}>
														{headerData.bottomLabel}
													</span>
												</div>
											</div>
										}
										{
											headerData.eventCount === 0	&& <div className={headerData.cellClass}>
												<span className={headerData.topLabelContainerClass}>
													{headerData.topLabel}
												</span>
												<span className={headerData.bottomLabelContainerClass}>
													{headerData.bottomLabel}
												</span>
											</div>
										}
										
									</th>
								)}
							</tr>
						</thead>
						{ !this.props.hideTopHeader &&
							<tbody>
								{this.props.summary.map((summaryData, rowIndex) =>
									<tr key={'key-' + rowIndex} className={((rowIndex + 1) === (this.props.summary.length) ? 'last' : '')}>
										{ summaryData.restrictionList.map((eachDayRestrictions, colIndex) =>
											<td onClick={(e) => this.props.onTdClick(e, rowIndex, colIndex)} key={'key-' + colIndex} className='cell'>
												<div className={'cell-container ' + (this.props.dateList[colIndex].isWeekEnd ? 'weekend_day': '')}>
													<div className={'cell-content ' + (this.props.dateList[colIndex].isPastDate ? 'isHistory-cell-content': '')}>
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
						}
					</table>
					{
						(this.props.mode === RM_RX_CONST.RATE_VIEW_MODE || this.props.mode === RM_RX_CONST.RATE_TYPE_VIEW_MODE) &&
						<RateManagerGridRightSideAvailableRoomsHeaderContainer />
					}
					
				</div>
			</div>
		);
	}
});