const NightlyDiaryRoomsListComponent = ({ roomListToComponent }) => {

console.log("reached here ----")
    return (
        <div id='rate-manager-not-configured' className='no-content'>
            <div className="info">
               {'ROOMSLIST COMPONENT === '+roomListToComponent.roomsList[0].room_type}
            </div>
        </div>
    )
};

const { PropTypes } = React;

// NightlyDiaryRoomsListContainer.propTypes = {
//   shouldShow:
// }