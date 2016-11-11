const NightlyDiaryRootComponent = () => (

	<div id="diary-nightly-grid" className="grid-content scrollable {'top-pagination' if you can only load previous, or 'bottom-pagination' if you can only load next, or 'dual-pagination' if you can load both}">
        <div className="wrapper">
            <GoToPreviousPageButtonContainer/>
            <GoToNextPageButtonContainer/>
            <NightlyDiaryRoomsListContainer/>
        </div>
    </div>
);
