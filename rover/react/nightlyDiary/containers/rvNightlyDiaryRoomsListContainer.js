const {connect} = ReactRedux;

const mapStateNightlyDiaryRoomsListContainerProps = (state) => ({
    shouldShow: (state.mode === NIGHTLY_DIARY_SEVEN_MODE)
});

const RateManagerNotConfiguredContainer = connect(
  mapStateNightlyDiaryRoomsListContainerProps
)(NightlyDiaryRoomsListContainer);