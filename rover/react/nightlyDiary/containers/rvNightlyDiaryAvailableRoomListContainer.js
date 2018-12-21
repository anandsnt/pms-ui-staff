const { connect } = ReactRedux;

const mapStateToNightlyDiaryUnAvailableRoomListContainerProps = (state) => ({
    state,
    clickedBookRoom: state.callBackFromAngular.clickedBookRoom
});

const NightlyDiaryAvailableRoomListContainer = connect(
    mapStateToNightlyDiaryUnAvailableRoomListContainerProps
)(NightlyDiaryAvailableRoomListComponent);