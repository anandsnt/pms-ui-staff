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
							<tr>
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
					</table>
				</div>
			</div>
		);
	}
});