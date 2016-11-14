const NightlyDiaryReservationsListComponent = ({ reservationsListToComponent }) => {

    return (
        <div className="grid-reservations firstday-fri">
        {
            reservationsListToComponent.map((item) => (
                    <div className="grid-row">
                        {

                            item.reservations.length > 0 ?
                                item.reservations.map((reservationItem) => (
                                        <ReservationComponent reservation={reservationItem} />

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