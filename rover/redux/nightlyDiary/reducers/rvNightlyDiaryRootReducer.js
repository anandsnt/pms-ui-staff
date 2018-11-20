const nightlyDiaryRootReducer = (state, action) => (
    {
        roomsList: nightlyDiaryRoomsListReducer(state, action),
        reservationsList: nightlyDiaryReservationsListReducer(state, action),
        diaryInitialDayOfDateGrid: (action.type === 'DIARY_VIEW_CHANGED') ? action.diaryInitialDayOfDateGrid : state.diaryInitialDayOfDateGrid,
        numberOfDays: (action.type === 'DIARY_VIEW_CHANGED') ? action.numberOfDays : state.numberOfDays,
        currentBusinessDate: (action.type === 'DIARY_VIEW_CHANGED') ? action.currentBusinessDate : state.currentBusinessDate,
        isAvailableRoomSlotActive: action.isAvailableRoomSlotActive,
        availableSlotsForAssignRooms: action.availableSlotsForAssignRooms,
        showAvailableRooms: action.showAvailableRooms,
        availableFreeSlots: action.availableFreeSlots,
        callBackFromAngular: callBackReducer(state, action),
        paginationData: paginationDataReducer(state, action),
        selectedReservationId: (action.type === 'RESERVATION_SELECTED' || action.type === 'CANCEL_RESERVATION_EDITING')
            ? action.selectedReservationId
            : state.selectedReservationId,
        currentSelectedReservation: (action.type === 'RESERVATION_SELECTED' || action.type === 'CANCEL_RESERVATION_EDITING')
            ? action.currentSelectedReservation
            : state.currentSelectedReservation,
        selectedRoomId: (action.type === 'DIARY_VIEW_CHANGED' || action.type === 'RESERVATION_SELECTED') ? action.selectedRoomId : state.selectedRoomId,
        isFromStayCard: state.isFromStayCard,
        dateFormat: state.dateFormat,
        newArrivalPosition: (action.type === 'EXTEND_SHORTEN_RESERVATION') ? action.newArrivalPosition : '',
        newDeparturePosition: (action.type === 'EXTEND_SHORTEN_RESERVATION') ? action.newDeparturePosition : '',
        isPmsProductionEnvironment: state.isPmsProductionEnvironment
    }
);

