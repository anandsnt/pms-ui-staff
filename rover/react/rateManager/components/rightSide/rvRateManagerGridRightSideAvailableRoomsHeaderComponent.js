const { createClass } = React;

const RateManagerGridRightSideAvailableRoomsHeaderComponent = createClass({

    render() {
        return (
            <table className="rate-calendar rate-calendar-availability">
                <tbody>
                    <tr className="last">
                        {
                            this.props.houseAvailability && this.props.houseAvailability.map((availability, colIdx) => 
                                <td className="cell" key={'house-available-' + colIdx}>
                                    <div className={'cell-container ' + availability.headerClass}> 
                                        <div className='cell-content'>
                                            {availability.count}
                                        </div>
                                    </div>
                                </td>     
                        )}

                    </tr>
                </tbody>
            </table>
        );
    }

});