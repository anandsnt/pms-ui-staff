const {connect} = ReactRedux;

const mapStateToNightlyDiaryRoomContainerProps = (state, ownProps) => (
{
    // shouldShow: (state.mode === NIGHTLY_DIARY_SEVEN_MODE)
    //roomComponent: eachRoom
});

const mapStateDispatchToNightlyDiaryRoomContainerProps = (state, ownProps) => (
{
    // shouldShow: (state.mode === NIGHTLY_DIARY_SEVEN_MODE)
    //roomComponent: eachRoom
});

const NightlyDiaryRoomContainer = connect(
  mapStateToNightlyDiaryRoomContainerProps,
  null,
  mapStateDispatchToNightlyDiaryRoomContainerProps
)(NightlyDiaryRoomComponent);