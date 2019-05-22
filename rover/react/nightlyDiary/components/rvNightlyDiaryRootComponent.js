const { createClass, PropTypes } = React;
const { findDOMNode } = ReactDOM;
const NightlyDiaryRootComponent = createClass ({
    scrollToPos(pos) {
        const node = document.getElementById('diary-nightly-grid');
        
        node.scrollTop = pos;

    },
    scrollToNthelement(n) {
         let width = document.getElementsByClassName("room not-clickable")[0].clientHeight,
             scrollTo = n * width ;
 
        this.scrollToPos(scrollTo);
    },
    componentDidUpdate() {
        this.scrollToNthelement(this.props.index);
    },
    render() {
        return (
        <div className="grid-inner">
            {(this.props.selectedReservationId !== undefined && this.props.selectedReservationId !== "") ? <NightlyDiaryStayRangeContainer/> : ''}
            <div id="diary-nightly-grid" className={this.props.ClassForRootDiv}>
                <div className="wrapper">
                    {this.props.showPrevPageButton ? <GoToPreviousPageButtonContainer/> : ''}
                    {this.props.showNextPageButton ? <GoToNextPageButtonContainer/> : ''}

                    <NightlyDiaryRoomsListContainer/>

                    <NightlyDiaryReservationsListContainer/>
                </div>
            </div>
        </div>
    );
    }
});

NightlyDiaryRootComponent.propTypes = {
    showNextPageButton: PropTypes.bool.isRequired,
    showPrevPageButton: PropTypes.bool.isRequired,
    ClassForRootDiv: PropTypes.string.isRequired,
    scrollTo: PropTypes.object
};
