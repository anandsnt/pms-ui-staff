const {createClass} = React

const RateManagerGridRightSideRowsComponent = createClass({

	componentDidMount() {
		this.setWidth();
		//this.props.refreshScrollers();
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
		if(this.props.mode === RM_RX_CONST.RATE_VIEW_MODE){
			return <RateManagerGridRightSideRestrictionRowsContainer/>
		}
	}
});