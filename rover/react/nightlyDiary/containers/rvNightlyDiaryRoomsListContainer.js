const {connect} = ReactRedux;

let convertRoomsListReadyToComponent = roomsList => {

    // divStyle = {
    //   color: 'blue'
    // };


    roomsList.map((room, index) => {
            room.room_class = (room.room_status === "clean") ? {color: 'green'}: {color: 'red'};
        }
    )

     console.log("--++---")
     console.log(roomsList)
    return roomsList;
    // for (var value of roomsList) {
    //     console.log("-----")
    //     console.log(value);
    // }
}


const mapStateToNightlyDiaryRoomsListContainerProps = (state) => ({
    // shouldShow: (state.mode === NIGHTLY_DIARY_SEVEN_MODE)
    roomListToComponent: convertRoomsListReadyToComponent(state.roomsList)
});

const NightlyDiaryRoomsListContainer = connect(
  mapStateToNightlyDiaryRoomsListContainerProps
)(NightlyDiaryRoomsListComponent);