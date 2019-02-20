const isRoomAvailable = (roomId, state, type) => {
    const unAssignedRoomList = state.availableSlotsForAssignRooms.availableRoomList;
    let flagforAvailable = false;
    let roomDetails = {};

    unAssignedRoomList.forEach(function (item) {
        if (item.room_id === roomId) {
            flagforAvailable = true;
            roomDetails = item;
        }
    });
    if (flagforAvailable && type === 'ASSIGN') {
        return (
            <NightlyDiaryAssignRoomContainer roomDetails={roomDetails} />
        );
    }
    if (flagforAvailable && type === 'MOVE') {
        return (
            <NightlyDiaryMoveRoomContainer roomDetails={roomDetails} />
        );
    }

    return false;
};

const NightlyDiaryReservationsListComponent = ({ reservationsListToComponent, roomRowClass, showAssignRooms, showMoveRooms, state }) => {

    return (
        <div className={roomRowClass}>
            {
                reservationsListToComponent.map((item) => (
                    <div className={item.roomClass}>{/* class=grid-row. */}
                        {

                            item.reservations.length > 0 ?
                                item.reservations.map((reservationItem) => (
                                    <NightlyDiaryReservationContainer reservation={reservationItem} room={item} />
                                )
                                )

                                : ''
                        }
                        {
                            item.ooo_oos_details.length > 0 ?
                                item.ooo_oos_details.map((oooOosItem) => (
                                    <NightlyDiaryOutOfOrderOutOfServiceContainer ooo_oos={oooOosItem} room={item} />
                                )
                                )

                                : ''
                        }
                        {
                            showAssignRooms ?

                                isRoomAvailable(item.id, state, 'ASSIGN')
                                : ''
                        }
                        {
                            showMoveRooms ?

                                isRoomAvailable(item.id, state, 'MOVE')
                                : ''
                        }
                        {
                            state.isBookRoomViewActive && item.availableSlotsForBookRooms && item.availableSlotsForBookRooms.length > 0 ?
                                item.availableSlotsForBookRooms.map((availableDate) => (
                                    <NightlyDiaryAvailableRoomListContainer date={availableDate} room={item} />
                                )
                                )
                                : ''
                        }

                        {
                            item.hourly_reservations.length > 0 ?

                                item.hourly_reservations.map((hourlyItem) => (
                                    <NightlyDiaryHourlyContainer hourlyItem={hourlyItem} />
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