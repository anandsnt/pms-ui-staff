const { createClass } = React;

const NightlyDiaryHourlyComponent = createClass({

    render() {
        return (
            <span >
                <div
                    style={{
                        height: '100%',
                        width: this.props.hourly_data.style.width,
                        transform: this.props.hourly_data.style.transform,
                        color: 'white',
                        backgroundColor: 'black',
                        border: 'solid 1px white',
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    Hourly
                </div>
            </span>
        );
    }
});
