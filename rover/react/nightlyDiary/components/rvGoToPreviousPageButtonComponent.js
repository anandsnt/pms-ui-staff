const GoToPreviousPageButtonComponent = ({goToPrevButtonClicked }) =>
     (
        <div className="grid-pagination top">
            {
                <button type="button" className="button blue" onClick={(e) => goToPrevButtonClicked(e)}>Prev X Rooms</button>
            }
        </div>
    );

const { PropTypes } = React;
GoToPreviousPageButtonComponent.propTypes = {
  goToPrevButtonClicked: PropTypes.func
}