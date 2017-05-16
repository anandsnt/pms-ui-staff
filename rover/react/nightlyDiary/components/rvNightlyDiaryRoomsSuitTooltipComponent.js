const { PropTypes } = React;

const NightlyDiaryRoomsSuitTooltipComponent = ({suites}) => 
    <div className="suites-rooms top">
        <strong>Suite Rooms</strong>
        <div className="rooms">
            {
                suites.map((suiteItem) =>
                <span className="suite-room">
                    <span className="icons icon-suite-white"></span>
                    {suiteItem.room_no}
                </span>)
            }
        </div>
    </div>;

NightlyDiaryRoomsSuitTooltipComponent.propTypes = {
    suites: PropTypes.array.isRequired
};
