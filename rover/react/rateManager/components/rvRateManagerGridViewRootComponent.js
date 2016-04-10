const { createClass } = React

const RateManagerGridViewRootComponent = createClass ({
	componentDidMount() {
		this.commonIScrollOptions = {
			probeType:3,
			scrollbars: false,
			scrollX: false,
			scrollY: true,
			click: true,
			mouseWheel: true
		};

		this.leftScrollableElement = this.rightScrollableElement = null;
		this.leftScroller = this.rightScroller = null;
		this.scrolling = false;
		this.setScrollers();
		console.log('ended: ', new Date().getTime());
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
			this.leftScroller.on('scrollStart', this.leftScrollerStarted);
			this.leftScroller.on('scrollEnd', this.leftScrollingEnded);
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
			this.rightScroller.on('scrollStart', this.rightScrollerStarted);
			this.rightScroller.on('scrollEnd', this.rightScrollingEnded);
		}
	},

	leftScrollingEnded() {
		if(this.scrolling && 
			Math.abs(this.leftScroller.maxScrollY) * 0.90 < Math.abs(this.leftScroller.y)) {

			this.scrolling = false;
			this.props.scrollReachedBottom();
		}
		if(this.scrolling && 
			Math.abs(this.leftScroller.maxScrollY) * 0.10 > Math.abs(this.leftScroller.y)) {

			this.scrolling = false;
			this.props.scrollReachedTop();
		}
	},

	leftScrollerStarted() {
		this.scrolling = true;
	},

	rightScrollerStarted() {
		this.scrolling = true;
	},

	rightScrollingEnded() {
		if(this.scrolling && 
			Math.abs(this.rightScroller.maxScrollY) * 0.90 < Math.abs(this.rightScroller.y)) {

			this.scrolling = false;
			this.props.scrollReachedBottom();
		}
		if(this.scrolling && 
			Math.abs(this.rightScroller.maxScrollY) * 0.10 > Math.abs(this.rightScroller.y)) {

			this.scrolling = false;
			this.props.scrollReachedTop();
		}		
	},


	setScrollerSync() {
		if(this.rightScroller && this.leftScroller) {
			this.leftScroller.on('scroll', () => {
				this.rightScroller.scrollTo(this.rightScroller.x, this.leftScroller.y);
			});
			this.rightScroller.on('scroll', () => {
				this.leftScroller.scrollTo(this.leftScroller.x, this.rightScroller.y);
			});
		}
	},

	refreshScrollers() {
		var rightScroller = this.rightScroller,
			leftScroller = this.leftScroller;
		if(rightScroller && leftScroller) {
			setTimeout(() => {
				rightScroller.refresh();
				leftScroller.refresh();
			}, 0);
		}

	},

	componentDidUpdate() {
		this.leftScrollableElement = this.rightScrollableElement = null;
		if(this.leftScroller) {
			this.leftScroller.destroy();
		}
		if(this.rightScroller) {
			this.rightScroller.destroy();
		}		
		this.leftScroller = this.rightScroller = null;		
		this.setScrollers();
		this.refreshScrollers();
		console.log('ended: ', new Date().getTime());
	},

	render() {
		if(!this.props.shouldShow) {
			return false;
		}

		return (
			<div className={'calendar-wraper zoom-level-' + this.props.zoomLevel}>
				<RateManagerGridLeftSideComponent/>
				<RateManagerGridRightSideComponent/>
				<RateManagerBottomRestrictionListContainer/>
			</div>
		);		
	}
});


const { PropTypes } = React;

RateManagerGridViewRootComponent.propTypes = {
  zoomLevel: PropTypes.string
};
