const NightlyDiaryRoomsListComponent = ({ roomListToComponent }) => {

    return (
        <div id='rate-manager-not-configured' className='no-content'>
            <div className="info">

               {
                roomListToComponent.roomsList.map((item, index) =>
                    <div>{item.room_type}</div>
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