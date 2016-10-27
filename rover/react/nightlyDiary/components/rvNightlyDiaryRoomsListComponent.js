const NightlyDiaryRoomsListComponent = ({ roomListToComponent }) => {

    return (
        <div id='rate-manager-not-configured' className='no-content'>
            <div className="info">

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