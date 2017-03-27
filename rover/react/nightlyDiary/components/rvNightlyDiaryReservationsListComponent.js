const NightlyDiaryReservationsListComponent = ({ reservationsListToComponent, roomRowClass }) => {

    return (
        <div className={roomRowClass}>
            {
                reservationsListToComponent.map((item) => (
                        <div className={item.roomClass}>
                            {

                                item.reservations.length > 0 ?
                                    item.reservations.map((reservationItem) => (
                                            <NightlyDiaryReservationContainer reservation={reservationItem} room={item}  />
                                        )
                                    )

                                : ''
                            }
                            {
                                item.ooo_oos_details.length > 0 ?
                                    item.ooo_oos_details.map((oooOosItem) => (
                                            <NightlyDiaryOutOfOrderOutOfServiceContainer ooo_oos={oooOosItem} room={item}  />
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