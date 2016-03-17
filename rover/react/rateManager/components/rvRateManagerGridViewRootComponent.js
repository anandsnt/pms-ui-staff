const { createClass } = React

const RateManagerGridViewRootComponent = createClass ({
	componentDidMount() {
		this.commonIScrollOptions = {
			probeType: 3,
			scrollbars: false,
			scrollX: false,
			scrollY: true,
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
		this.setScrollerSync();
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

	setScrollerSync() {
		if(this.rightScroller && this.leftScroller) {
			this.leftScroller.on('scroll', () => {
				this.rightScroller.scrollTo(this.rightScroller.x, this.leftScroller.y)
			});
			this.rightScroller.on('scroll', () => {
				this.leftScroller.scrollTo(this.leftScroller.x, this.rightScroller.y)
			});			 
		}
	},

	refreshScrollers() {
		var rightScroller = this.rightScroller,
			leftScroller = this.leftScroller;
		setTimeout(() => {
			rightScroller.refresh();
			leftScroller.refresh();
		}, 0);	

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


const { PropTypes } = React;

RateManagerGridViewRootComponent.propTypes = {
  zoomLevel: PropTypes.string
};
