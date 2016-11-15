const { createClass, PropTypes } = React
const { findDOMNode } = ReactDOM
const NightlyDiaryRootComponent = createClass ({
  componentDidMount() {
    this.scrollOptions = {
      probeType:3,
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
    if(!this.scrollableElement) {
      this.scrollableElement = findDOMNode(this);
    }
    this.scroller = new IScroll(this.scrollableElement, this.scrollOptions);
    this.refreshScroller();
  },
  refreshScroller(){
    setTimeout(() => {this.scroller.refresh()},1000);
  },
  render() {
    return (
      <div id="diary-nightly-grid" className={this.props.ClassForRootDiv}>
        <div className="wrapper">
            {(this.props.showPrevPageButton)?<GoToPreviousPageButtonContainer/>:''}
            {(this.props.showNextPageButton)?<GoToNextPageButtonContainer/>:''}
            <NightlyDiaryRoomsListContainer/>
            <NightlyDiaryReservationsListContainer/>
        </div>
      </div>
    );
  }
});

NightlyDiaryRootComponent.propTypes = {
  showNextPageButton: PropTypes.bool.isRequired,
  showPrevPageButton: PropTypes.bool.isRequired,
  ClassForRootDiv 	: PropTypes.string.isRequired
}
