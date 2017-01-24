const NightlyDiaryStayRangeComponent = createClass ({
    getInitialState: function() {
        let currentSelectedReservation = this.props.currentSelectedReservation,
            departurePosition = parseInt(currentSelectedReservation.arrivalPosition) + currentSelectedReservation.duration,
            arrivalPositionInt = parseInt(currentSelectedReservation.arrivalPosition),
            minAllowedPositionForDeparture = (this.props.numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) ? NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21 : NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7,
            daysMode = this.props.numberOfDays,
            oneDayWidth = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / daysMode;

        return {
            isArrivalDragging: false,
            isDepartureDragging: false,
            mouseClikedX: 0,
            mouseLastPositionX: 0,
            arrivalStyle: currentSelectedReservation.arrivalStyle,
            departureStyle: currentSelectedReservation.departureStyle,
            // this.props.currentSelectedReservation.arrivalPosition / departurePosition is in the form of xxPX
            arrivalPosition: parseInt(currentSelectedReservation.arrivalPosition),
            maxArrivalFlagPos: Math.min(departurePosition, NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH) - oneDayWidth,
            minArrivalFlagPos: NIGHTLY_DIARY_CONST.DAYS_7_OFFSET,
            maxDepartureFlagPos: (daysMode - 1) * (NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / daysMode),
            minDepartureFlagPos: Math.max(arrivalPositionInt, minAllowedPositionForDeparture),
            departurePosition: departurePosition,
            reservationDuration: currentSelectedReservation.duration,
            daysMode: daysMode,
            onedayWidth: oneDayWidth
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
        state.isArrivalDragging = true;
        state.mouseClikedX = e.clientX;
        state.mouseLastPositionX = e.clientX;
        flagarea.removeEventListener(this.mouseLeavingEvent, () =>{});
        flagarea.addEventListener (this.mouseMovingEvent, e => this.mouseMove (e));
        flagarea.addEventListener (this.mouseLeavingEvent, e => this.mouseLeave (e));
        flagarea.addEventListener ('mouseleave', e => this.mouseLeave (e));
    },

    mouseLeave(e) {
        let state = this.state,
            flagarea = this.flagarea;

        e.preventDefault ();
        e.stopPropagation ();
        if (state.isArrivalDragging) {
            state.isArrivalDragging = false;
            this.calculateArrivalDate();
        }
        if(state.isDepartureDragging) {
            state.isDepartureDragging = false;
        }
        flagarea.removeEventListener(this.mouseMovingEvent, () =>{});
        flagarea.removeEventListener(this.mouseLeavingEvent, () =>{});
    },

    mouseMove(e) {
        e.preventDefault ();
        e.stopPropagation ();
        let state = this.state,
            diff = e.clientX - this.state.mouseLastPositionX;

        if(state.isArrivalDragging) {            
            this.moveArrivalFlag(diff);
        }
        if(state.isDepartureDragging) {            
            this.moveDepartureFlag(diff);
        }
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
        if (state.isArrivalDragging) {
            this.props.extendShortenReservation(curentPosition, this.departurePosition);
            this.setState({
                arrivalStyle: {
                    transform: 'translateX(' + curentPosition + 'px)'
                },
                arrivalPosition: curentPosition
            });
        }
    },

    departureFlagMouseDown(e) {
        let state = this.state,
            flagarea = this.flagarea;

        e.preventDefault ();
        e.stopPropagation ();
        e = this.isTouchEnabled ? e.changedTouches[0] : e;
        state.isDepartureDragging = true;
        state.mouseClikedX = e.clientX;
        state.mouseLastPositionX = e.clientX;
        flagarea.addEventListener (this.mouseMovingEvent, e => this.mouseMove (e));
        flagarea.addEventListener (this.mouseLeavingEvent, e => this.mouseLeave (e));
        flagarea.addEventListener ('mouseleave', e => this.mouseLeave (e));
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

        if (state.isDepartureDragging) {
            this.props.extendShortenReservation(this.arrivalPosition, curentPosition);
            this.setState({
                departureStyle: {
                    transform: 'translateX(' + curentPosition + 'px)'
                },
                departurePosition: curentPosition
            });
        }
    },

    calculateArrivalDate() {
        let state = this.state,
            props = this.props,
            initialArrivalPosition = parseInt(props.currentSelectedReservation.arrivalPosition),
            differenceInPosition = state.arrivalPosition - initialArrivalPosition,
            differenceInDays = Math.round(differenceInPosition / state.onedayWidth),
            curentPosition = initialArrivalPosition + (differenceInDays * state.onedayWidth);

        props.extendShortenReservation(curentPosition);
        this.setState({
            arrivalStyle: {
                transform: 'translateX(' + curentPosition + 'px)'
            },
            arrivalPosition: curentPosition
        });
    },
    // TODO : -
    updateFlagRanges() {

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