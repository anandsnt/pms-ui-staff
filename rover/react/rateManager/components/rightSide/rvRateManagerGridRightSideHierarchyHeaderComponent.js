const { createClass } = React
const { findDOMNode } = ReactDOM

const RateManagerGridRightSideHierarchyHeaderComponent = createClass({
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
			<div className={'calendar-rate-table calendar-rate-table-days scrollable ' + this.props.hierarchyRestrictionClass}>
				<div className='wrapper'>
					<table className='rate-calendar'>
						<thead>
							<tr className="cell">
								{this.props.headerDataList.map( (headerData, index) =>
									<th className={headerData.headerClass} key={"header-data-" + index}>
										<div className={headerData.cellClass}>
											<span className={headerData.topLabelContainerClass}>
												{headerData.topLabel}
											</span>
											<span className={headerData.bottomLabelContainerClass}>
												{headerData.bottomLabel}
											</span>
										</div>
									</th>
								)}
							</tr>
						</thead>
						<tbody>
							{
								this.props.showHouse &&
								<RateManagerHierarchyHouseHeaderContainer/>
							}
							{/* {
								this.props.showRoomType &&
								<RateManagerHierarchyRoomTypeHeaderContainer/>
							} */}
							{/* {
								this.props.showRateType &&
								<RateManagerHierarchyRateTypeHeaderContainer/>
							}
							{
								this.props.showRate &&
								<RateManagerHierarchyRateHeaderContainer/>
							} */}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
});