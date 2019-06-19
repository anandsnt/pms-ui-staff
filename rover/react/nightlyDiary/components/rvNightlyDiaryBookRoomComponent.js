const { createClass } = React;

const NightlyDiaryBookRoomComponent = createClass({
    getStyles() {
        const width = this.props.uar_data.style.width;
        const position = this.props.uar_data.style.transform;
        const style = {
            width: width,
            transform: position
        };

        return style;
    },
    render() {
        return (
            <div style={this.getStyles()}
                className="reservation unassigned"
                onClick={() => this.props.bookRoom(this.props.roomDetails)}
            >
                <div className="reservation-data">
                    <span className="name">BOOK</span>
                </div>
            </div>
        );
    }
});

