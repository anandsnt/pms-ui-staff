const { createClass } = React;

const NightlyDiaryAssignRoomComponent = createClass({
    getStyles() {
        const width = this.props.uar_data.style.width;
        const position = this.props.uar_data.style.transform;
        const style = {
            width: width,
            transform: position,
            display: 'block'
        };

        return style;
    },
    render() {
        return (
            <div style={this.getStyles()}
                className="reservation unassigned"
                onClick={() => this.props.assignRoom(this.props.roomDetails, this.props.availableSlotsForAssignRooms)}
            >
                <div className="reservation-data">
                    ASSIGN
                <span className="name">{this.props.roomDetails.room_number}</span>
                </div>
            </div>
        );
    }
});

