const NightlyDiaryReservationsListComponent = ({ reservationsListToComponent }) => {

    return (
        <div className="grid-reservations firstday-fri">
        {
            reservationsListToComponent.map((item) => (
                    <div className="grid-row">
                        {

                            item.reservations.length > 0 ?
                                item.reservations.map((reservationItem) => (
                                        <div style={reservationItem.style} className={reservationItem.reservationClass}>
                                            {reservationItem.confirm_no}
                                        </div>
                                    )
                                )

                            : ''

                        }
                    </div>
                )
            )
        }
        </div>
    );
};


const { PropTypes } = React;

NightlyDiaryReservationsListComponent.propTypes = {
  reservationsListToComponent: PropTypes.array.isRequired
}