const NightlyDiaryStayRangeComponent = createClass ({
    getInitialState: function() {
        let currentSelectedReservation = this.props.currentSelectedReservation,
            departurePos = parseInt(currentSelectedReservation.arrivalPosition) + currentSelectedReservation.duration,
            arrivalPositionInt = parseInt(currentSelectedReservation.arrivalPosition),
            minAllowedPositionForDeparture = (this.props.numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) ? NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21 : NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7,
            daysMode = this.props.numberOfDays,
            oneDayWidth = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / daysMode;
console.log((daysMode - 1) * (NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / daysMode));
 console.log(Math.max(arrivalPositionInt, minAllowedPositionForDeparture))
        return {
            isMouseDragging: false,
            mouseClikedX: 0,
            mouseLastPositionX: 0,
            arrivalStyle: currentSelectedReservation.arrivalStyle,
            departureStyle: currentSelectedReservation.departureStyle,
            // this.props.currentSelectedReservation.arrivalPosition / departurePosition is in the form of xxPX
            arrivalPosition: parseInt(currentSelectedReservation.arrivalPosition),
            maxArrivalFlagPos: Math.min(departurePos, NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH) - oneDayWidth,
            minArrivalFlagPos: NIGHTLY_DIARY_CONST.DAYS_7_OFFSET,
            maxDepartureFlagPos: (daysMode - 1) * (NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / daysMode),
            minDepartureFlagPos: Math.max(arrivalPositionInt, minAllowedPositionForDeparture),
            departurePosition: departurePos,
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
        this.departureFlag.addEventListener (this.mouseStartingEvent, e => this.departureFlagMouseDown (e));
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
            this.props.extendShortenReservation(curentPosition, this.departurePosition);
            this.setState({
                arrivalStyle: {
                    transform: 'translateX(' + curentPosition + 'px)'
                },
                arrivalPosition: curentPosition
            });

        }
    },
    moveDepartureFlag(diff) {
        let state = this.state,
            curentPosition = state.departurePosition + diff;


        if (curentPosition > state.maxDepartureFlagPos) {
            curentPosition = state.maxDepartureFlagPos;
        }
        if (curentPosition < state.minDepartureFlagPos) {
            curentPosition = state.minDepartureFlagPos;
        }

        if (state.isMouseDragging) {
            this.props.extendShortenReservation(this.arrivalPosition, curentPosition);
            this.setState({
                departureStyle: {
                    transform: 'translateX(' + curentPosition + 'px)'
                },
                departurePosition: curentPosition
            });


        }


    },

    departureFlagMouseDown(e) {
        let state = this.state,
            flagarea = this.flagarea;

        e.preventDefault ();
        e.stopPropagation ();
        e = this.isTouchEnabled ? e.changedTouches[0] : e;
        state.isMouseDragging = true;
        state.mouseClikedX = e.clientX;
        state.mouseLastPositionX = e.clientX;
        flagarea.addEventListener (this.mouseMovingEvent, e => this.departureFlagMouseMove (e));
        flagarea.addEventListener (this.mouseLeavingEvent, e => this.arrivalFlagMouseLeave (e));
        flagarea.addEventListener ('mouseleave', e => this.arrivalFlagMouseLeave (e));
    },
    departureFlagMouseMove(e) {
        e.preventDefault ();
        e.stopPropagation ();
        let diff = e.clientX - this.state.mouseLastPositionX;
        this.moveDepartureFlag(diff);
        this.state.mouseLastPositionX = e.clientX;
    },

    calculateArrivalDate() {
        console.log("calculateArrivalDate");
    },

    render() {
        let arrivalStyle = this.state.arrivalStyle,
            departureStyle = this.state.departureStyle,
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
                <a style={departureStyle} className="handle departure">
                    <span className="title" ref={node => this.departureFlag = node}>
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