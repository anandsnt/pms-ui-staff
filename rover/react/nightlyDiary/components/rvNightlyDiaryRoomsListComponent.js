const NightlyDiaryRoomsListComponent = ({ roomListToComponent }) => {

    return (

        <div className="grid-room-search-results visible">
        {/*<!-- Room Search Results above line -->*/}
        {/*<!-- Add class 'visible' to show -->*/}
            <div className="wrapper">
               {
                roomListToComponent.map((item, index) =>
                    <div className="room">
                        <span className="room-number {HK status or 'out' if OOO/OOS}">
                            {item.room_no}
                        {/*<!-- Highlight search query like this: <span class="highlight">{Query}</span> -->*/}
                        </span>
                        <span className="room-type">{item.room_type}</span>
                    </div>

                    )
               }
            </div>
        </div>
    )
};


//const { PropTypes } = React;

// NightlyDiaryRoomsListContainer.propTypes = {
//   shouldShow:
// }