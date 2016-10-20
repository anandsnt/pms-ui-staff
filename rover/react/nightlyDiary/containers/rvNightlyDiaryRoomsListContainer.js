const {connect} = ReactRedux;

const mapStateToNightlyDiaryRoomsListContainerProps = (roomsList) => ({
    // shouldShow: (state.mode === NIGHTLY_DIARY_SEVEN_MODE)
    roomListToComponent: roomsList
});

const NightlyDiaryRoomsListContainer = connect(
  mapStateToNightlyDiaryRoomsListContainerProps
)(NightlyDiaryRoomsListComponent);