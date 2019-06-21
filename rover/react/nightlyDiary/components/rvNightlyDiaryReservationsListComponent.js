const isRoomAvailable = (roomId, state, type) => {

    let unAssignedRoomList = [];
    let roomTypeList = [];
    let flagforAvailable = false;
    let roomDetails = {};
    let roomTypeDetails = {};
    let bookType = 'BOOK';
    let diaryMode = state.diaryMode;

    console.log('diaryMode', diaryMode);

    if (type === 'BOOK') {
        unAssignedRoomList = state.availableSlotsForBookRooms.rooms;
        roomTypeList = state.availableSlotsForBookRooms.room_types;
    }
    else if (type === 'ASSIGN' || type === 'MOVE') {
        unAssignedRoomList = state.availableSlotsForAssignRooms.availableRoomList;
    }
    
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
    if (flagforAvailable && type === 'BOOK') {

        roomTypeList.forEach(function (item) {
            if (item.room_type_id === roomDetails.room_type_id) {
                roomTypeDetails = item;
            }
        });

        if (diaryMode === 'FULL') {
            bookType = 'BOOK';
        }
        else if (diaryMode === 'NIGHTLY' || diaryMode === 'DAYUSE') {

            if (roomTypeDetails.availability > 0) {
                bookType = 'BOOK';
            }
            /* TODO CICO-65955 : Overbook logic will go here */
            /* bookType = 'OVERBOOK'; */
            /* bookType = 'OVERBOOK_DISABLED' */
        }
        
        return (
            <NightlyDiaryBookRoomContainer roomDetails={roomDetails} roomTypeDetails={roomTypeDetails} type={bookType}/>
        );
    }

    return false;
};

const NightlyDiaryReservationsListComponent = ({ reservationsListToComponent, roomRowClass, showAssignRooms, showMoveRooms, showBookRooms, state }) => {

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
                            showBookRooms ?

                                isRoomAvailable(item.id, state, 'BOOK')
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