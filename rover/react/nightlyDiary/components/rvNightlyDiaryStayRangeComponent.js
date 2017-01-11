const NightlyDiaryStayRangeComponent = createClass ({

    render() {
        return (
            <div className={this.props.currentSelectedReservation.class}>
                <a style={this.props.currentSelectedReservation.arrivalStyle} className="handle arrival left"  >
                    <span className="title">
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