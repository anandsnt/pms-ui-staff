const { PropTypes } = React;

/**
 * Component to display room list at left side of diary grid
 * Component with local state since it is presentational only.
 */
class NightlyDiaryRoomsListComponent extends React.Component {
    /**
     * [constructor description]
     * @param  {[type]} props [description]
     * @return {[type]}       [description]
     */
    constructor(props) {
        super(props);
        this.state = {
            selectedRoom: null
        };
    }

    /**
     * [showSuitRoomsList description]
     * @param {Number} index [description]
     * @return {Undefined} [description]
     */
    setSelectedRoom(index) {
        this.setState({
            selectedRoom: (index === this.state.selectedRoom) ? null : index
        });
    }

    /**
     * Show the room status and service status update popup
     * @param {Object} item - room object
     * @return {void}
     */
    showRoomStatusUpdatePopup(item) {
        this.props.showUpdateRoomStatusAndServicePopup(item);
    }

    /**
     * [renderRoom description]
     * @param {Object} item roomData
     * @param {Number} index item index on list
     * @return {Object} React element
     */
    renderRoom(item, index) {
        const isSelected = this.state.selectedRoom === index;
        const couchIcon = item.isSuitesAvailable ?
            <span className="suite-room" onClick={this.setSelectedRoom.bind(this, index)}>
                <span className="icons icon-suite-white"></span>
            </span> : null;

        return (
            <div className={item.main_room_class} key={index} >
                <span className={item.room_class} onClick={this.showRoomStatusUpdatePopup.bind(this, item)}>{item.room_no}</span>
                <span className="room-type">{item.room_type_name}</span>
                <div className="suites">
                    {/* Clickable suite icon, clicking will open a popup with list of suit components */}
                    { couchIcon }
                    { isSelected ? <NightlyDiaryRoomsSuitTooltipComponent suites={item.suite_room_details} /> : null}
                </div>
            </div>
        );
    }

    /**
     * [render description]
     * @return {[type]} [description]
     */
    render() {
        return (
             <div className="grid-rooms">
                { this.props.roomListToComponent.map(this.renderRoom.bind(this)) }
            </div>
        );
    }
}

NightlyDiaryRoomsListComponent.propTypes = {
    roomListToComponent: PropTypes.array.isRequired
};
