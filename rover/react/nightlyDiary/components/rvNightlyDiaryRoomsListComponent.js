const NightlyDiaryRoomsListComponent = ({ roomListToComponent }) => {

    return (
            <div className="grid-rooms">
            {
                roomListToComponent.map((item, index) =>
                    <div className="room">
                    {/* <!-- Add className 'highlighted' if jumped to this room -->*/}
                        <span className={item.room_class}>{item.room_no}</span>
                        <span className="room-type">{item.room_type_name}</span>
                       {/* <!-- If suite room, show this -->*/}
                       {(item.isSuitesAvailable)  ?
                            (<div className="suites">
                                {
                                    item.suite_room_details.map((suiteItem, suiteIndex) =>
                                    <span className="suite-room">
                                        <span className="icons icon-suite-white"></span>
                                        {suiteItem.room_no}
                                    </span>)

                                }
                               {/* ... repeat L6-L9 for every suite room (we support up to 4)*/}
                            </div>)
                            : ''
                        }


                    </div>
                )
            }
            </div>
        )
};


const { PropTypes } = React;

NightlyDiaryRoomsListComponent.propTypes = {
  roomListToComponent: PropTypes.array.isRequired
}