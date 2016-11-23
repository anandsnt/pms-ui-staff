const NightlyDiaryReservationsListComponent = ({ reservationsListToComponent, roomRowClass, goToReservationStayCard }) => {

    return (
        <div className={roomRowClass}>
        {
            reservationsListToComponent.map((item) => (
                    <div className="grid-row">
                        {

                            item.reservations.length > 0 ?
                                item.reservations.map((reservationItem) => (

                                    <ReservationComponent reservation={reservationItem} onClickMethod={(e, reservationItem) => goToReservationStayCard(e, reservationItem)} />


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
};