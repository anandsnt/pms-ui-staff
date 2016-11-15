const GoToPreviousPageButtonComponent = ({goToPrevButtonClicked, perPage }) =>
     (
        <div className="grid-pagination top">
            {
                <button type="button" className="button blue" onClick={(e) => goToPrevButtonClicked(e)}>{"Prev "+perPage+" Rooms"}</button>
            }
        </div>
    );

const { PropTypes } = React;
GoToPreviousPageButtonComponent.propTypes = {
  goToPrevButtonClicked	: PropTypes.func,
  perPage				: PropTypes.number
}