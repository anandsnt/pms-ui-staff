const { connect } = ReactRedux;

const mapStateToNightlyDiaryUnAvailableRoomListContainerProps = (state) => ({
    state
});

const NightlyDiaryAvailableRoomListContainer = connect(
    mapStateToNightlyDiaryUnAvailableRoomListContainerProps
)(NightlyDiaryAvailableRoomListComponent);