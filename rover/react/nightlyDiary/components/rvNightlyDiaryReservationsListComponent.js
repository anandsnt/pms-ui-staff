const NightlyDiaryReservationsListComponent = ({ reservationsListToComponent, roomRowClass, goToReservationStayCard }) => {

    return (
        <div className={roomRowClass}>
        {
            reservationsListToComponent.map((item) => (
                    <div className={item.roomClass}>
                        {

                            item.reservations.length > 0 ?
                                item.reservations.map((reservationItem) => (

                                    <NightlyDiaryReservationContainer reservation={reservationItem} />


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