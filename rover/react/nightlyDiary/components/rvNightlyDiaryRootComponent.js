const NightlyDiaryRootComponent = () => (

	<div id="diary-nightly-grid " className="grid-content scrollable dual-pagination">
        <div className="wrapper">
            <GoToPreviousPageButtonContainer/>
            <GoToNextPageButtonContainer/>
            <NightlyDiaryRoomsListContainer/>
            <NightlyDiaryReservationsListContainer/>
        </div>
    </div>
);
