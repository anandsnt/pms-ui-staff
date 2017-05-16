const { PropTypes } = React;

/**
 * Component to display room number in room list of left sidebar.
 * This is a component with state.
 */
class NightlyDiaryRoomsListItemComponent extends React.Component {
    /**
     * [constructor description]
     * @param  {[type]} props [description]
     * @return {[type]}       [description]
     */
    constructor(props) {
        super(props);
        this.state = {
            showSuiteList: false
        };
        this.showSuitRoomsList = this.showSuitRoomsList.bind(this);
    }

    /**
     * [showSuitRoomsList description]
     * @return {[type]} [description]
     */
    showSuitRoomsList() {
        this.setState({
            showSuiteList: !this.state.showSuiteList
        });
    }

    /**
     * [render description]
     * @return {[type]} [description]
     */
    render() {
        const item = this.props.roomData;
        const isSelected = this.state.showSuiteList;
        const couchIcon = 
            <span className="suite-room" onClick={this.showSuitRoomsList}>
                <span className="icons icon-suite-white"></span>
            </span>;

        // const tooltipClassList = `suites-rooms ${condition ? 'top' : ''`;
        const suitRoomsTooltip = 
            <div className="suites-rooms top">
                <strong>Suite Rooms</strong>
                <div className="rooms">
                    {
                        item.suite_room_details.map((suiteItem) =>
                        <span className="suite-room">
                            <span className="icons icon-suite-white"></span>
                            {suiteItem.room_no}
                        </span>)
                    }
                </div>
            </div>;

        return (
            <div className={item.main_room_class}>
                <span className={item.room_class}>{item.room_no}</span>
                <span className="room-type">{item.room_type_name}</span>
                <div className="suites">
                    {/* Clickable suite icon, clicking will open a popup with list of suit components */}
                    { item.isSuitesAvailable ? couchIcon : null}
                    { isSelected ? suitRoomsTooltip : null}
                </div>
            </div>
        );
    }
}

NightlyDiaryRoomsListItemComponent.propTypes = {
    roomData: PropTypes.object.isRequired
};

const NightlyDiaryRoomsListComponent = ({ roomListToComponent }) =>
    <div className="grid-rooms">
    {
        roomListToComponent.map((item, i) =>
            <NightlyDiaryRoomsListItemComponent roomData={item} key={i}/>
        )
    }
    </div>;


// const { PropTypes } = React;

NightlyDiaryRoomsListComponent.propTypes = {
    roomListToComponent: PropTypes.array.isRequired
};
