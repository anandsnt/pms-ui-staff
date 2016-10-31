const {connect} = ReactRedux;

let convertRoomsListReadyToComponent = roomsList => {

    roomsList.map((room, index) => {
            room.room_class = "room-number "+room.hk_status
        }
    )
    return roomsList;
}


const mapStateToNightlyDiaryRoomsListContainerProps = (state) => ({
    // shouldShow: (state.mode === NIGHTLY_DIARY_SEVEN_MODE)
    roomListToComponent: convertRoomsListReadyToComponent(state.roomsList)
});

const NightlyDiaryRoomsListContainer = connect(
  mapStateToNightlyDiaryRoomsListContainerProps
)(NightlyDiaryRoomsListComponent);