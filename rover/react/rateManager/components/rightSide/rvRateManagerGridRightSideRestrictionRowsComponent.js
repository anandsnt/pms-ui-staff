const {createClass} = React
const {findDOMNode} = ReactDOM

const RateManagerGridRightSideRestrictionRowsComponent = createClass({

	componentDidMount() {
		this.setWidth();
	},

	componentDidUpdate() {
		this.setWidth();
		this.props.refreshScrollers();
	},

	shouldComponentUpdate(nextProp, nextState) {
		return !(nextProp.action === RM_RX_CONST.REFRESH_SCROLLERS);
	},

	setWidth() {
		var myDomNode = $(findDOMNode(this)),
			tableElement = myDomNode.parents(".rate-calendar")[0],
			tableParentElement = myDomNode.parents(".wrapper")[0];
		tableParentElement.style.width = tableElement.offsetWidth + 'px';
	},

	render() {
		if(this.props.mode !== RM_RX_CONST.RATE_VIEW_MODE 
			&& this.props.mode !== RM_RX_CONST.ROOM_TYPE_VIEW_MODE ) {
			return false;
		}
		return (
			<tbody>
				{this.props.restrictionRows.map((rateData, rowIndex) => 
					<tr key={'key-' + rowIndex}>
						{rateData.restrictionList.map((eachDayRestrictions, colIndex) => 
							<td key={'key-' + colIndex} className='cell'>
								<div className='cell-container'>
									<div className='cell-content'>
									{eachDayRestrictions.map((restriction, restrictionIndex) => 
										<RateManagerRestrictionIconComponent key={'key-' + restrictionIndex}
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
	}
});
