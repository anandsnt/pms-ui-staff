const {connect} = ReactRedux;

let convertRoomsListReadyToComponent = roomsList => {

    roomsList.map((room, index) => {
        room.room_class = "room-number "+room.hk_status
        room.isSuitesAvailable = (room.suite_room_details.length > 0) ? true : false;
    })
    return roomsList;
}


const mapStateToNightlyDiaryRoomsListContainerProps = (state) => ({
    roomListToComponent: convertRoomsListReadyToComponent(state.roomsList)
});

const NightlyDiaryRoomsListContainer = connect(
  mapStateToNightlyDiaryRoomsListContainerProps
)(NightlyDiaryRoomsListComponent);