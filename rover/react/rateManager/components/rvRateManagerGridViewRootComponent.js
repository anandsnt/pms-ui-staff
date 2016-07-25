const { createClass } = React

const RateManagerGridViewRootComponent = createClass ({
	componentDidMount() {
		this.commonIScrollOptions = {
			probeType:3,
			scrollbars: false,
			scrollX: false,
			scrollY: true,
			preventDefault: true,
			preventDefaultException: { tagName: /^(BUTTON)$/i },
			mouseWheel: true,
			deceleration: 0.0009
		};

		this.leftScrollableElement = this.rightScrollableElement = this.rightHeadScrollableElement = null;
		this.leftScroller = this.rightScroller = this.rightHeaderScroller = null;
		this.scrolling = false;
		this.startingScroll_Y_Position = 0;
		this.setScrollers();
	},

	setScrollers() {
		this.setLeftScroller();
		this.setRightScroller();
		this.setRightHeadScroller();
		this.setScrollerSync();
	},

	setLeftScroller() {
		if(this.props.shouldShow && !this.leftScrollableElement) {
			this.leftScrollableElement = $(findDOMNode(this)).find(".pinnedLeft-list")[0];
		}

		//if the left scroller become invalid
		if(this.leftScroller && this.leftScroller.wrapper instanceof Element && !document.body.contains(this.leftScroller.wrapper)) {
			this.leftScroller = null;
		}

		if(this.props.shouldShow && !this.leftScroller) {
			this.leftScroller = new IScroll(this.leftScrollableElement, this.commonIScrollOptions);
		}
	},

	setRightHeadScroller() {
		if(this.props.shouldShow && !this.rightHeadScrollableElement) {
			this.rightHeadScrollableElement = $(findDOMNode(this)).find(".calendar-rate-table-days.scrollable")[0];
		}

		//if the right head scroller become invalid
		if(this.rightHeadScroller && this.rightHeadScroller.wrapper instanceof Element && !document.body.contains(this.rightHeadScroller.wrapper)) {
			this.rightHeadScroller = null;
		}

		if(this.props.shouldShow && !this.rightHeadScroller) {
			this.rightHeadScroller = new IScroll(this.rightHeadScrollableElement, {
				...this.commonIScrollOptions,
				scrollX: true,
				scrollY: true,
				scrollbars: false
			});
		}
	},

	setRightScroller() {
		if(this.props.shouldShow && !this.rightScrollableElement) {
			this.rightScrollableElement = $(findDOMNode(this)).find(".calendar-rate-table-grid.scrollable")[0];
		}

		//if the right scroller become invalid
		if(this.rightScroller && this.rightScroller.wrapper instanceof Element && !document.body.contains(this.rightScroller.wrapper)) {
			this.rightScroller = null;
		}

		if(this.props.shouldShow && !this.rightScroller) {
			this.rightScroller = new IScroll(this.rightScrollableElement, {
				...this.commonIScrollOptions,
				scrollX: true,
				click: true,
				scrollbars: 'custom'
			});
		}
	},

	setScrollerSync() {
		if(this.rightScroller && this.leftScroller && this.rightHeadScroller ) {
			this.leftScroller.on('scroll', () => {

				this.rightScroller.scrollTo(this.rightScroller.x, this.leftScroller.y);
			});
			this.rightScroller.on('scroll', () => {
				this.leftScroller.scrollTo(this.leftScroller.x, this.rightScroller.y);
				this.rightHeadScroller.scrollTo(this.rightScroller.x, this.rightHeadScroller.y);
			});

			this.rightHeadScroller.on('scroll', () => {
				this.rightScroller.scrollTo(this.rightHeadScroller.x, this.rightScroller.y)
			});
		}
	},

	refreshScrollers() {
		var rightScrollerExist = this.rightScroller instanceof IScroll,
			rightHeadScrollerExist = this.rightHeadScroller instanceof IScroll,
			leftScrollerExist = this.leftScroller instanceof IScroll;

		if(rightScrollerExist && leftScrollerExist && rightHeadScrollerExist) {
			
			setTimeout(() => {
				this.rightScroller.refresh();
				this.leftScroller.refresh();
				this.rightHeadScroller.refresh();

				if(!!this.props.scrollTo) {
					let scrollTo = this.props.scrollTo;

					let offsetX = !!scrollTo.offsetX ? scrollTo.offsetX : undefined,
						offsetY = !!scrollTo.offsetY ? scrollTo.offsetY : undefined;

					//right scroller
					if(!_.isUndefined(scrollTo.col)) {
						let rightHeadScrollDomNode = '.rate-calendar thead tr th:nth-child(' + scrollTo.col +')';
						this.rightHeadScroller.scrollToElement(rightHeadScrollDomNode, 0, offsetX, offsetY);
						this.rightHeadScroller.refresh();
					}

					if(!_.isUndefined(scrollTo.row)) {
						let commonDomScrollDomNode = 'tr:nth-child(' + scrollTo.row + ')';

						//left scroller
						let leftDomScrollDomNode = '.pinnedLeft-list .rate-calendar tbody ' + commonDomScrollDomNode;
						this.leftScroller.scrollToElement(leftDomScrollDomNode, 0, offsetX, offsetY);
						this.leftScroller.refresh();

						if(!_.isUndefined(scrollTo.col)) {
							let rightBottomScrollDomNode = '#rateViewCalendar tbody ' + 
								commonDomScrollDomNode + ' td:nth-child(' + scrollTo.col +')';
							this.rightScroller.scrollToElement(rightBottomScrollDomNode, 0, offsetX, offsetY);
							this.rightScroller.refresh();
						}
					}
				}
			}, 0);
		}
	},

	componentDidUpdate() {		
		this.setScrollers();
		this.refreshScrollers();
	},

	render() {
		if(!this.props.shouldShow) {
			//this dom node related variables need to invalidate
			this.leftScrollableElement = this.rightScrollableElement = this.rightHeadScrollableElement = null;
			this.leftScroller = this.rightScroller = this.rightHeaderScroller = null;
			return false;
		}

		return (
			<div className={this.props.wrapperClass}>
				<RateManagerGridLeftSideComponent/>
				<RateManagerGridRightSideHeaderContainer/>
				<RateManagerGridRightSideBottomComponent/>
				<RateManagerBottomRestrictionListContainer/>
			</div>
		);		
	}
});
