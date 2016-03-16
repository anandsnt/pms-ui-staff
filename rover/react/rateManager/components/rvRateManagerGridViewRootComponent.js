const { Component, createClass } = React

const RateManagerGridViewRootComponent = createClass ({
	componentDidMount() {
		this.commonIScrollOptions = {
				probeType: 2,
				scrollbars: 'custom',
				interactiveScrollbars: true,
				scrollX: true,
				scrollY: true,
				bounce: false,
				momentum: false,
				preventDefaultException: { className: /(^|\s)(occupied|available|reserved)(\s|$)/ },
				mouseWheel: true,
				useTransition: true
			};

		this.leftScrollableElement = null;
		
		this.leftScroller = null;

		if(this.props.shouldShow) {
			this.leftScrollableElement = $(findDOMNode(this)).find(".scrollable.pinnedLeft")[0];
			this.leftScroller = new IScroll(this.leftScrollableElement, this.commonIScrollOptions);
		}
	},

	componentDidUpdate() {
		if(!this.leftScrollableElement) {
			this.leftScrollableElement = $(findDOMNode(this)).find(".scrollable.pinnedLeft")[0];
		}
		if(!this.leftScroller) {
			this.leftScroller = new IScroll(this.leftScrollableElement, this.commonIScrollOptions);
		}
		this.leftScroller.refresh();
	},

	render() {

		if(!this.props.shouldShow) {
			return false;
		}

		return (
			<div className={'calendar-wraper zoom-level-' + this.props.zoomLevel}>
				<RateManagerCalendarLeftSideComponent/>
				<RateManagerBottomRestrictionList/>
			</div>
		);		
	}
});


// const RateManagerGridViewRootComponent = ({ zoomLevel }) => (

// );

const { PropTypes } = React;

RateManagerGridViewRootComponent.propTypes = {
  zoomLevel: PropTypes.string
};
