const NightlyDiaryRoomsListComponent = ({ roomListToComponent }) => {

    return (

        <div className="grid-room-search-results visible">
        {/*<!-- Room Search Results above line -->*/}
        {/*<!-- Add class 'visible' to show -->*/}
            <div className="wrapper">
               {
                roomListToComponent.map((item, index) =>
                    <div style={item.room_class}>
                    {item.room_type}
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