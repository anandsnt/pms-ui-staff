const {createClass} = React

const RateManagerGridRightSideRowsComponent = createClass({

	componentDidMount() {
		this.setWidth();
	},

	componentDidUpdate() {
		this.setWidth();
		this.props.refreshScrollers();
	},

	setWidth() {
		var myDomNode = $(findDOMNode(this)),
			tableElement = myDomNode.parents(".rate-calendar")[0],
			tableParentElement = myDomNode.parents(".wrapper")[0];
		tableParentElement.style.width = tableElement.offsetWidth + 'px';
	},
	render() {
		return (
			<tbody>
			{this.props.list.map((rateData) =>
				<tr>
					{rateData.restrictionList.map((eachDayRestrictions) =>
						<td className='cell'>
							<div className='cell-container'>
								<div className='cell-content'></div>
							</div>
						</td>
					)}		
				</tr>
			)}
			</tbody>
		)
	}
});