const { createClass, PropTypes } = React;
const { findDOMNode } = ReactDOM;
const NightlyDiaryRootComponent = createClass ({
    componentDidMount() {
       
    },
    scrollToPos(pos,width) {
        const node = document.getElementById('diary-nightly-grid');
        node.scrollTop = pos;
        // var smooth_scroll_to = function(element, target, duration) {
        //     target = Math.round(target);
        //     duration = Math.round(duration);
        //     if (duration < 0) {
        //         return Promise.reject("bad duration");
        //     }
        //     if (duration === 0) {
        //         element.scrollTop = target;
        //         return Promise.resolve();
        //     }

        //     var start_time = Date.now();
        //     var end_time = start_time + duration;

        //     var start_top = element.scrollTop;
        //     var distance = target - start_top;

        //     // based on http://en.wikipedia.org/wiki/Smoothstep
        //     var smooth_step = function(start, end, point) {
        //         if(point <= start) { return 0; }
        //         if(point >= end) { return 1; }
        //         var x = (point - start) / (end - start); // interpolation
        //         return x*x*(3 - 2*x);
        //     }

        //     return new Promise(function(resolve, reject) {
        //         // This is to keep track of where the element's scrollTop is
        //         // supposed to be, based on what we're doing
        //         var previous_top = element.scrollTop;

        //         // This is like a think function from a game loop
        //         var scroll_frame = function() {
        //             if(element.scrollTop != previous_top) {
        //                 reject("interrupted");
        //                 return;
        //             }

        //             // set the scrollTop for this frame
        //             var now = Date.now();
        //             var point = smooth_step(start_time, end_time, now);
        //             var frameTop = Math.round(start_top + (distance * point));
        //             element.scrollTop = frameTop;

        //             // check if we're done!
        //             if(now >= end_time) {
        //                 resolve();
        //                 return;
        //             }

        //             // If we were supposed to scroll but didn't, then we
        //             // probably hit the limit, so consider it done; not
        //             // interrupted.
        //             if(element.scrollTop === previous_top
        //                 && element.scrollTop !== frameTop) {
        //                 resolve();
        //                 return;
        //             }
        //             previous_top = element.scrollTop;

        //             // schedule next frame for execution
        //             setTimeout(scroll_frame, 0);
        //         }

        //         // boostrap the animation process
        //         setTimeout(scroll_frame, 0);
        //     });
        // }
        // smooth_scroll_to(node, pos, 500);  
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
