const {createClass} = React
const {findDOMNode} = ReactDOM

const RateManagerGridRightSideHeaderComponent = createClass({

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
			<thead>
				<tr>
					{this.props.headerDataList.map( headerData => 
						<th className={headerData.headerClass}>
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
		);
	}
});