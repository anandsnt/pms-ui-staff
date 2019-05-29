const { createClass } = React;

const NightlyDiaryHourlyComponent = createClass({

    render() {
        return (
            <div
                style={{
                    width: this.props.hourly_data.style.width,
                    transform: this.props.hourly_data.style.transform
                }}
                className={this.props.hourly_data.reservationClass}
            >
                <div className="reservation-data">
                    <span className="day-stay-icon"></span>
                </div>
            </div>
        );
    }
});
