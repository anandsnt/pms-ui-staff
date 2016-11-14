const GoToNextPageButtonComponent = ({goToNextButtonClicked }) =>
     (
        <div className="grid-pagination bottom">
            {
                <button type="button" className="button blue" onClick={(e) => goToNextButtonClicked(e)}>Prev X Rooms</button>
            }
        </div>
    );

const { PropTypes } = React;
GoToNextPageButtonComponent.propTypes = {
  goToNextButtonClicked: PropTypes.func
}