const NightlyDiaryRootComponent = ({showNextPageButton,showPrevPageButton,ClassForRootDiv}) => (


	<div id="diary-nightly-grid" className={ClassForRootDiv}>
        <div className="wrapper">
            {(showPrevPageButton)?<GoToPreviousPageButtonContainer/>:''}
            {(showNextPageButton)?<GoToNextPageButtonContainer/>:''}
            <NightlyDiaryRoomsListContainer/>
            <NightlyDiaryReservationsListContainer/>
        </div>
    </div>
);
const { PropTypes } = React;

NightlyDiaryRootComponent.propTypes = {
  showNextPageButton: PropTypes.bool.isRequired,
  showPrevPageButton: PropTypes.bool.isRequired,
  ClassForRootDiv 	: PropTypes.string.isRequired
}
