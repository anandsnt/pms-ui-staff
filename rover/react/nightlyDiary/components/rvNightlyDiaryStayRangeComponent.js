const NightlyDiaryStayRangeComponent = createClass ({

    componentDidMount() {

    },
    mouseMove: function(e) {
        console.log("jphme");
        console.log(e.clientX);
        console.log(this.props.currentSelectedReservation.arrivalPosition);

    },
    render() {
        return (
            <div className={this.props.currentSelectedReservation.class}>
                <a style={this.props.currentSelectedReservation.style} className="handle arrival left" onMouseMove={(e) => this.mouseMove(e)} >
                    <span className="title">
                        Arrival
                        <span className="date">{this.props.currentSelectedReservation.arrival_date}</span>
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