const NightlyDiaryStayRangeComponent = createClass ({
    getInitialState: function() {
        return {            
            isMouseDragging: false,
            mouseClikedX: 0,
            mouseLastPositionX: 0,
            arrivalStyle: this.props.currentSelectedReservation.arrivalStyle,
            arrivalPosition: this.props.currentSelectedReservation.arrivalPosition123
        };
    },

    componentDidMount: function() {
        this.isTouchEnabled     = 'ontouchstart' in window;
        this.mouseStartingEvent = this.isTouchEnabled ? 'touchstart' : 'mousedown';
        this.mouseMovingEvent   = this.isTouchEnabled ? 'touchmove' : 'mousemove';
        this.mouseLeavingEvent  = this.isTouchEnabled ? 'touchend'  : 'mouseup';
        this.arrivalflag.addEventListener (this.mouseStartingEvent, e => this.arrivalFlagMouseDown (e));
    },

    arrivalFlagMouseDown(e) {
        console.log(e);
        let state = this.state;
        e.preventDefault ();
        e.stopPropagation ();
        e = this.isTouchEnabled ? e.changedTouches[0] : e;
        state.isMouseDragging = true;
        state.mouseClikedX = e.clientX;
        state.mouseLastPositionX = e.clientX;
        this.arrivalflag.addEventListener (this.mouseMovingEvent, e => this.arrivalFlagMouseMove (e));
        this.arrivalflag.addEventListener (this.mouseLeavingEvent, e => this.arrivalFlagMouseLeave (e));
        this.arrivalflag.addEventListener ('mouseleave', e => this.arrivalFlagMouseLeave (e));
    },

    arrivalFlagMouseLeave(e) {
        e.preventDefault ();
        e.stopPropagation ();
        this.state.isMouseDragging = false;
        this.arrivalflag.removeEventListener(this.mouseMovingEvent, () =>{ console.log("key up"); });
        this.arrivalflag.removeEventListener(this.mouseLeavingEvent, () =>{ console.log("key up"); });
    },

    arrivalFlagMouseMove(e) {
        console.log("Move");
        console.log(e);
        e.preventDefault ();
        e.stopPropagation ();
        let diff = e.clientX - this.state.mouseLastPositionX;

        this.moveArrivalFlag(diff);
        this.state.mouseLastPositionX = e.clientX;
    },

    moveArrivalFlag(diff) {
        let newPosition = this.state.arrivalPosition + diff;        
        if (this.state.isMouseDragging) {
            this.setState({
                arrivalStyle: {
                    transform: 'translateX(' + newPosition + 'px)'
                },
                arrivalPosition: newPosition
            });
        }
    },

    render() {
        console.log("Render");
        console.log(this.state);
        let arrivalStyle = this.state.arrivalStyle,
            reservationClass = this.props.currentSelectedReservation.class;

        return (
            <div className={reservationClass} ref={node => this.arrivalflag = node}>
                <a style={arrivalStyle} className="handle arrival left" >
                    <span className="title" >
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