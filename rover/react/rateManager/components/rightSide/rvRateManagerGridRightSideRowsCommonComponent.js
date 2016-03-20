const {createClass} = React
const {findDOMNode} = ReactDOM

const RateManagerGridRightSideRowsCommonComponent = InnerComponent => createClass({
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
		return <InnerComponent {...this.props} {...this.state}/>
	}
});