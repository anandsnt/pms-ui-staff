const { createClass } = React;

const NightlyDiaryMoveRoomComponent = createClass({
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
                onClick={() => this.props.moveRoom(this.props.roomDetails, this.props.availableSlotsForAssignRooms)}
            >
                <div className="reservation-data">
                    MOVE
                <span className="name">{this.props.roomDetails.room_number}</span>
                </div>
            </div>
        );
    }
});

