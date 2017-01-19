const NightlyDiaryStayRangeComponent = createClass ({
    getInitialState: function() {
        return {            
            isMouseDragging: false,
            mouseClikedX: 0,
            mouseLastPositionX: 0,
            arrivalStyle: this.props.currentSelectedReservation.arrivalStyle,
            // this.props.currentSelectedReservation.arrivalPosition / departurePosition is in the form of xxPX
            arrivalPosition: parseInt(this.props.currentSelectedReservation.arrivalPosition),
            departurePosition: parseInt(this.props.currentSelectedReservation.departurePosition),
            daysMode: 7
        };
    },

    componentDidMount: function() {
        this.isTouchEnabled     = 'ontouchstart' in window;
        this.mouseStartingEvent = this.isTouchEnabled ? 'touchstart' : 'mousedown';
        this.mouseMovingEvent   = this.isTouchEnabled ? 'touchmove' : 'mousemove';
        this.mouseLeavingEvent  = this.isTouchEnabled ? 'touchend'  : 'mouseup';
        this.arrivalFlag.addEventListener (this.mouseStartingEvent, e => this.arrivalFlagMouseDown (e));
    },

    arrivalFlagMouseDown(e) {
        let state = this.state,
            flagarea = this.flagarea;

        e.preventDefault ();
        e.stopPropagation ();
        e = this.isTouchEnabled ? e.changedTouches[0] : e;
        state.isMouseDragging = true;
        state.mouseClikedX = e.clientX;
        state.mouseLastPositionX = e.clientX;
        flagarea.addEventListener (this.mouseMovingEvent, e => this.arrivalFlagMouseMove (e));
        flagarea.addEventListener (this.mouseLeavingEvent, e => this.arrivalFlagMouseLeave (e));
        flagarea.addEventListener ('mouseleave', e => this.arrivalFlagMouseLeave (e));
    },

    arrivalFlagMouseLeave(e) {
        let state = this.state,
            flagarea = this.flagarea;

        e.preventDefault ();
        e.stopPropagation ();
        // TODO - remove this check and remove 'mouseleave' listner
        if (state.isMouseDragging) {
            state.isMouseDragging = false;
            this.calculateArrivalDate();
        }
        
        flagarea.removeEventListener(this.mouseMovingEvent, () =>{});
        flagarea.removeEventListener(this.mouseLeavingEvent, () =>{});
    },

    arrivalFlagMouseMove(e) {
        e.preventDefault ();
        e.stopPropagation ();
        let diff = e.clientX - this.state.mouseLastPositionX;

        this.moveArrivalFlag(diff);
        this.state.mouseLastPositionX = e.clientX;
    },

    moveArrivalFlag(diff) {
        let state = this.state,
            curentPosition = state.arrivalPosition + diff;

        if (state.isMouseDragging) {
            this.setState({
                arrivalStyle: {
                    transform: 'translateX(' + curentPosition + 'px)'
                },
                arrivalPosition: curentPosition
            });
        }
    },

    calculateArrivalDate() {
        console.log("calculateArrivalDate");
    },

    render() {
        let arrivalStyle = this.state.arrivalStyle,
            reservationClass = this.props.currentSelectedReservation.class;

        return (
            <div className={reservationClass} ref={node => this.flagarea = node}>
                <a style={arrivalStyle} className="handle arrival left" >
                    <span className="title" ref={node => this.arrivalFlag = node}>
                        Arrival
                        <span className="date">{this.props.currentSelectedReservation.arrivalDate}</span>
                    </span>
                    <span className="line"></span>
                </a>
                <a style={this.props.currentSelectedReservation.departureStyle} className="handle departure">
                    <span className="title">
                        Departure
                        <span className="date">{this.props.currentSelectedReservation.deptDate}</span>
                    </span>
                    <span className="line"></span>
                </a>
            </div>
        );
    }


});


const { PropTypes } = React;

NightlyDiaryStayRangeComponent.propTypes = {
  currentSelectedReservation: PropTypes.currentSelectedReservation
};