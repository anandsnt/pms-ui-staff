const { createClass, PropTypes } = React;
const { findDOMNode } = ReactDOM;
const NightlyDiaryRootComponent = createClass ({
    componentDidMount() {
       
    },
    scrollToPos(pos,width) {
        const node = document.getElementById('diary-nightly-grid');
        node.scrollTop = pos;
        // code for interpolation effect
        // let step = (pos - node.scrollTop) / 50;
        // let scrollStep = setInterval(function () {
        //     node.scrollTop = node.scrollTop + step;
        //     console.log('end',node.offsetHeight+node.scrollTop === node.scrollHeight)
        //     console.log('range',node.scrollTop,pos)
        //     if(Math.abs(node.scrollTop - pos) === 0 || node.offsetHeight+node.scrollTop === node.scrollHeight){
        //         clearInterval(scrollStep);
        //     }            
        // }, 5);   
    },
    scrollToNthelement(n) {
        let width = document.getElementsByClassName("room")[1].clientHeight,
            scrollTo = n * width ;
        this.scrollToPos(scrollTo,width)     
    },
    componentDidUpdate() {
        this.scrollToNthelement(this.props.index);
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
            <div className="diary-nightly-sidebar diary-nightly-unassigned hidden">
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
