const {connect} = ReactRedux;

let convertRoomsListReadyToComponent = (roomsList, selectedRoomId) => {
    roomsList.map((room, index) => {
        room.room_class = (room.service_status === 'IN_SERVICE') ? "room-number "+room.hk_status : "room-number out";
        room.main_room_class = (room.id === selectedRoomId) ? 'room highlighted' : 'room';
        room.isSuitesAvailable = (room.suite_room_details.length > 0) ? true : false;
    })
    return roomsList;
}


const mapStateToNightlyDiaryRoomsListContainerProps = (state) => ({
    roomListToComponent: convertRoomsListReadyToComponent(state.roomsList, state.paginationData.selectedRoomId)
});

const NightlyDiaryRoomsListContainer = connect(
  mapStateToNightlyDiaryRoomsListContainerProps
)(NightlyDiaryRoomsListComponent);