const NightlyDiaryStayRangeComponent = ({ currentSelectedReservation }) => {

    return (
            <div className="grid-stay-range">
                <a style={currentSelectedReservation.style} className="handle arrival left"  >
                    <span className="title">
                        Arrival
                        <span className="date">{currentSelectedReservation.arrival_date}</span>
                    </span>
                    <span className="line"></span>
                </a>
            </div>
    );
};


const { PropTypes } = React;

NightlyDiaryStayRangeComponent.propTypes = {
  currentSelectedReservationArrivalStyle: PropTypes.currentSelectedReservationArrivalStyle
};