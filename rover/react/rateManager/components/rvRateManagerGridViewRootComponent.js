const { Component, createClass } = React

const RateManagerGridViewRootComponent = createClass ({
	componentDidMount() {
		this.commonIScrollOptions = {
				probeType: 2,
				scrollbars: false,
				interactiveScrollbars: true,
				scrollX: false,
				scrollY: true,
				bounce: false,
				momentum: false,
				preventDefaultException: { className: /(^|\s)(occupied|available|reserved)(\s|$)/ },
				mouseWheel: true,
				useTransition: true
			};

		this.leftScrollableElement = this.rightScrollableElement = null;
		this.leftScroller = this.rightScroller = null;

		this.setScrollers();
	},

	setScrollers() {
		this.setLeftScroller();
		this.setRightScroller();
	},

	setLeftScroller() {
		if(this.props.shouldShow && !this.leftScrollableElement) {
			this.leftScrollableElement = $(findDOMNode(this)).find(".scrollable.pinnedLeft")[0];
		}
		if(this.props.shouldShow && !this.leftScroller) {
			this.leftScroller = new IScroll(this.leftScrollableElement, this.commonIScrollOptions);
		}
	},

	setRightScroller() {
		if(this.props.shouldShow && !this.rightScrollableElement) {
			this.rightScrollableElement = $(findDOMNode(this)).find(".calendar-rate-table.scrollable")[0];
		}
		if(this.props.shouldShow && !this.rightScroller) {
			this.rightScroller = new IScroll(this.rightScrollableElement, {
				...this.commonIScrollOptions,
				scrollX: true,
				scrollbars: 'custom'
			});
		}
	},

	refreshScrollers() {
		this.rightScroller.refresh();
		this.leftScroller.refresh();
	},

	componentDidUpdate() {
		this.setScrollers();
		this.refreshScrollers();
	},

	render() {

		if(!this.props.shouldShow) {
			return false;
		}

		return (
			<div className={'calendar-wraper zoom-level-' + this.props.zoomLevel}>
				<RateManagerGridLeftSideComponent/>
				<RateManagerCalendarRightSideComponent/>
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
