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
		this.startingScroll_Y_Position = 0;
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
			this.startingScroll_Y_Position > this.leftScroller.y &&
			Math.abs(this.leftScroller.maxScrollY) * 0.99 < Math.abs(this.leftScroller.y)) {

			this.scrolling = false;
			this.props.scrollReachedBottom(this.rightScroller.x, this.rightScroller.maxScrollX, this.rightScroller.y, this.rightScroller.maxScrollY);
		}
		if(this.scrolling &&
			this.startingScroll_Y_Position < this.leftScroller.y &&
			Math.abs(this.leftScroller.maxScrollY) * 0.01 > Math.abs(this.leftScroller.y)) {

			this.scrolling = false;
			this.props.scrollReachedTop(this.rightScroller.x, this.rightScroller.maxScrollX, this.rightScroller.y, this.rightScroller.maxScrollY);
		}
		this.startingScroll_Y_Position = this.leftScroller.y;
	},

	leftScrollerStarted() {

		this.scrolling = true;
		this.startingScroll_Y_Position = this.leftScroller.y;

		if(this.startingScroll_Y_Position === 0) {

		}
	},

	rightScrollerStarted() {

		this.scrolling = true;
		this.startingScroll_Y_Position = this.rightScroller.y;
	},

	rightScrollingEnded() {

		if(this.scrolling && 
			this.startingScroll_Y_Position > this.rightScroller.y &&
			Math.abs(this.rightScroller.maxScrollY) * 0.99 < Math.abs(this.rightScroller.y)) {

			this.scrolling = false;
		console.log(this.rightScroller.x, this.rightScroller.maxScrollX, this.rightScroller.y, this.rightScroller.maxScrollY);
			this.props.scrollReachedBottom(this.rightScroller.x, this.rightScroller.maxScrollX, this.rightScroller.y, this.rightScroller.maxScrollY);
		}
		if(this.scrolling && 
			this.startingScroll_Y_Position < this.rightScroller.y &&
			Math.abs(this.rightScroller.maxScrollY) * 0.01 > Math.abs(this.rightScroller.y)) {

			this.scrolling = false;
			this.props.scrollReachedTop(this.rightScroller.x, this.rightScroller.maxScrollX, this.rightScroller.y, this.rightScroller.maxScrollY);
		}	
		this.startingScroll_Y_Position = this.rightScroller.y;	
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
		var rightScrollerExist = this.rightScroller instanceof IScroll,
			leftScrollerExist = this.leftScroller instanceof IScroll;
		if(rightScrollerExist && leftScrollerExist) {
			setTimeout(() => {
				this.rightScroller.refresh();
				this.leftScroller.refresh();

				if(!!this.props.scrollTo) {
					let scrollTo = this.props.scrollTo;
					let commonDomScrollDomNode = 'tbody tr:nth-child(' + scrollTo.row + ')';

					//right scroller
					let rightDomScrollDomNode = '#rateViewCalendar ' + commonDomScrollDomNode + 
						' td:nth-child(' + scrollTo.col +')';

					let offsetX = !!scrollTo.centerTheColumn ? scrollTo.centerTheColumn : false,
						offsetY = !!scrollTo.centerTheRow ? scrollTo.centerTheRow : false;

					this.rightScroller.scrollToElement(rightDomScrollDomNode, 0, offsetX, offsetY);

					//left scroller
					let leftDomScrollDomNode = '.scrollable.pinnedLeft .rate-calendar ' + commonDomScrollDomNode;
					this.leftScroller.scrollToElement(leftDomScrollDomNode, 0, offsetX, offsetY);
					this.leftScroller.refresh();

				}
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
