const NightlyDiaryRoomsListComponent = ({ roomListToComponent }) => {

    return (

        <div className="grid-room-search-results visible">
        {/*<!-- Room Search Results above line -->*/}
        {/*<!-- Add class 'visible' to show -->*/}
            <div className="wrapper">
               {
                roomListToComponent.map((item, index) =>
                    <div className="room">
                        <span className={item.room_class}>
                            {item.room_no}
                        {/*<!-- Highlight search query like this: <span class="highlight">{Query}</span> -->*/}
                        </span>
                        <span className="room-type">{item.room_type_name}</span>
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