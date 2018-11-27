const { createClass } = React;

const NightlyDiaryHourlyComponent = createClass({

    render() {
        return (
            <div
                style={{
                    width: this.props.hourly_data.style.width,
                    transform: this.props.hourly_data.style.transform
                }}
                className="reservation dayuse"
            >
                <div className="reservation-data">
                    <span className="icons icon-diary-dayuse"></span>
                </div>
            </div>
        );
    }
});
