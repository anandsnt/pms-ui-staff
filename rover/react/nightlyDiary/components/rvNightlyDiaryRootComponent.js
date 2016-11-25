const { createClass, PropTypes } = React;
const { findDOMNode } = ReactDOM;
const NightlyDiaryRootComponent = createClass ({
    componentDidMount() {
        this.scrollOptions = {
            probeType: 3,
            scrollY: true,
            preventDefault: true,
            preventDefaultException: { tagName: /^(BUTTON)$/i },
            mouseWheel: true,
            deceleration: 0.0009,
            click: false,
            scrollbars: 'custom'
        };
        this.setScroller();
    },
    setScroller() {
        if (!this.scrollableElement) {
            this.scrollableElement = $(findDOMNode(this)).find('#diary-nightly-grid')[0];
        }
        this.scroller = new IScroll(this.scrollableElement, this.scrollOptions);
        this.refreshScroller();
    },
    refreshScroller() {
        this.scroller.refresh();
    },
    scrolToTop() {
        // scroll is moving to top
        // this.scroller.scrollToElement($(findDOMNode(this)).find(".room")[20], 1000, null, true);
        this.scroller.scrollTo(0, 0, 1000, null);
    },
    scrollToNthelement(n) {
        var width = $(findDOMNode(this)).find(".room")[0].clientHeight,
            scrollToX = n * width * -1;

        this.scroller.scrollTo(0, scrollToX);
    },
    componentDidUpdate() {
        this.refreshScroller();
        // this.scrolToTop();
        this.scrollToNthelement(30);
    },
    render() {
        return (
        <div className="grid-inner">
            <div id="diary-nightly-grid" className={this.props.ClassForRootDiv}>
                <div className="wrapper">
                    {this.props.showPrevPageButton ? <GoToPreviousPageButtonContainer/> : ''}
                    {this.props.showNextPageButton ? <GoToNextPageButtonContainer/> : ''}
                    <NightlyDiaryRoomsListContainer/>
                    <NightlyDiaryReservationsListContainer/>
                </div>
            </div>
            <div className="diary-nightly-sidebar diary-nightly-unassigned">
                <div className="sidebar-header">
                    <h2>Unassigned</h2>
                    <p>Drag & Drop to assign a room</p>
                </div>
                <div className="unassigned-labels">
                    <div className="data">Name / Room Type</div>
                    <div className="arrival">Arrival</div>
                    <div className="nights">Nights</div>
                </div>
                <div className="unassigned-list scrollable">
                    <div className="wrapper">
                        <div className="guest check-in">
                            <div className="data">
                                <strong className="name"></strong>
                                <span className="vip"></span>
                                <span className="room"></span>
                            </div>
                            <div className="arrival"></div>
                            <div className="nights"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }
});

NightlyDiaryRootComponent.propTypes = {
    showNextPageButton: PropTypes.bool.isRequired,
    showPrevPageButton: PropTypes.bool.isRequired,
    ClassForRootDiv: PropTypes.string.isRequired
};
