const isRoomAvailable = (roomId, state, type) => {

    let unAssignedRoomList = [];
    let roomTypeList = [];
    let flagforAvailable = false;
    let roomDetails = {};
    let roomTypeDetails = {};
    let bookType = 'BOOK';
    let diaryMode = state.diaryMode;
    let houseDetails = {};
    let canOverbookHouse = false;
    let canOverbookRoomType = false;

    let checkOverBooking = function() {
        var isHouseOverbookable     = houseDetails.house_availability <= 0 && houseDetails.unassigned_reseravtions_present,
            isRoomTypeOverbookable  = roomTypeDetails.availability <= 0 && roomTypeDetails.unassigned_reseravtions_present,
            canOverbookHouse        = canOverbookHouse,
            canOverbookRoomType     = canOverbookRoomType,
            canOverBookBoth         = canOverbookHouse && canOverbookRoomType,
            overBookingStatusOutput = '';

        if (isHouseOverbookable && isRoomTypeOverbookable && canOverBookBoth) {
            overBookingStatusOutput = 'HOUSE_AND_ROOMTYPE_OVERBOOK';
        }
        else if (isRoomTypeOverbookable && canOverbookRoomType && (!isHouseOverbookable || (isHouseOverbookable && canOverbookHouse) )) {
            overBookingStatusOutput = 'ROOMTYPE_OVERBOOK';
        }
        else if (isHouseOverbookable && canOverbookHouse && (!isRoomTypeOverbookable || (isRoomTypeOverbookable && canOverbookRoomType) )) {
            overBookingStatusOutput = 'HOUSE_OVERBOOK';
        }
        else {
            overBookingStatusOutput = 'NO_PERMISSION_TO_OVERBOOK';
        }

       return overBookingStatusOutput;
    };

    if (type === 'BOOK') {
        unAssignedRoomList = state.availableSlotsForBookRooms.rooms;
        roomTypeList = state.availableSlotsForBookRooms.room_types;
        houseDetails = state.availableSlotsForBookRooms.house;
        canOverbookHouse = state.availableSlotsForBookRooms.canOverbookHouse;
        canOverbookRoomType = state.availableSlotsForBookRooms.canOverbookRoomType;
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

            if (roomTypeDetails.availability > 0 && houseDetails.house_availability > 0) {
                bookType = 'BOOK';
            }
            else if (checkOverBooking() === 'NO_PERMISSION_TO_OVERBOOK') {
                bookType = 'OVERBOOK_DISABLED';
            }
            else {
                bookType = 'OVERBOOK';
            }
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