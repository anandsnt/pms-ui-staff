const GoToNextPageButtonComponent = ({goToNextButtonClicked, nextPageItemCount}) =>
    (
        <div className="grid-pagination bottom">
            {
                <button type = "button" className = "button blue" onClick = {(e) => goToNextButtonClicked(e)}>
                {'Next ' + nextPageItemCount + ' Rooms'}
                </button>
            }
        </div>
    );

const { PropTypes } = React;

GoToNextPageButtonComponent.propTypes = {
    goToNextButtonClicked: PropTypes.func,
    NextPageItemCount: PropTypes.number
};