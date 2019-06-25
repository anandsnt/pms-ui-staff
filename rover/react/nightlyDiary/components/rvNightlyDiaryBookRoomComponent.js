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
    getClassName() {
        let className = 'reservation unassigned ';

        if (this.props.type === 'OVERBOOK') {
            className += 'overbook';
        }
        else if (this.props.type === 'OVERBOOK_DISABLED') {
            className += 'overbook-disabled disable-element';
        }
        return className;
    },
    render() {
        return (
            <div style={this.getStyles()}
                className={this.getClassName()}
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

