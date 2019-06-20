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
                onClick={() => this.props.bookRoom(this.props.roomDetails, this.props.roomTypeDetails, this.props.type)}
            >
                <div className="reservation-data">
                    {this.props.type}
                    <span className="name">{this.props.roomDetails.room_no}</span>
                </div>
            </div>
        );
    }
});

