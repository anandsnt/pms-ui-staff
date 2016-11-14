const GoToNextPageButtonComponent = ({goToNextButtonClicked, perPage }) =>
     (
        <div className="grid-pagination bottom">
            {
                <button type="button" className="button blue" onClick={(e) => goToNextButtonClicked(e)}>{"Next "+perPage+" Rooms"}</button>
            }
        </div>
    );

const { PropTypes } = React;
GoToNextPageButtonComponent.propTypes = {
  goToNextButtonClicked : PropTypes.func,
  perPage				: PropTypes.number
}