const { createClass } = React
const { findDOMNode } = ReactDOM

const RateManagerGridRightSideRowsComponent = createClass({
	componentDidMount() {
		this.setWidth();
		this.props.hideLoader();
	},

	componentDidUpdate() {
		this.setWidth();
		this.props.refreshScrollers();
		this.props.hideLoader();
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
		var mode = this.props.mode;
		if(mode === RM_RX_CONST.RATE_VIEW_MODE || mode === RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
			return <RateManagerGridRightSideRowsRestrictionContainer/>
		}
		if(mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
			return <RateManagerGridRightSideRowsRestrictionListAndAmountContainer/>
		}
	}
});