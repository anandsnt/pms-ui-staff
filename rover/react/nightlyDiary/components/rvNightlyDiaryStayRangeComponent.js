const NightlyDiaryStayRangeComponent = createClass ({
    getInitialState: function() {
        let currentSelectedReservation = this.props.currentSelectedReservation,
            departurePos = parseInt(currentSelectedReservation.arrivalPosition) + currentSelectedReservation.duration,
            daysMode = NIGHTLY_DIARY_CONST.DAYS_7,
            oneDayWidth = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / daysMode;
        return {
            isMouseDragging: false,
            mouseClikedX: 0,
            mouseLastPositionX: 0,
            arrivalStyle: currentSelectedReservation.arrivalStyle,
            // this.props.currentSelectedReservation.arrivalPosition / departurePosition is in the form of xxPX
            arrivalPosition: parseInt(currentSelectedReservation.arrivalPosition),
            maxArrivalFlagPos: Math.min(departurePos, NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH) - oneDayWidth,
            minArrivalFlagPos: NIGHTLY_DIARY_CONST.DAYS_7_OFFSET,
            departurePos: departurePos,
            reservationDuration: currentSelectedReservation.duration,
            daysMode: daysMode
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

        if (curentPosition < state.minArrivalFlagPos) {
            curentPosition = state.minArrivalFlagPos;
        }

        if (curentPosition > state.maxArrivalFlagPos) {
            curentPosition = state.maxArrivalFlagPos;
        }

        if (state.isMouseDragging) {
            this.props.extendShortenReservation(curentPosition);

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