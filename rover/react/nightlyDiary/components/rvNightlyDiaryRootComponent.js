const NightlyDiaryRootComponent = () => (

	<div id="diary-nightly-grid" className="grid-content scrollable {'top-pagination' if you can only load previous, or 'bottom-pagination' if you can only load next, or 'dual-pagination' if you can load both}">
        <div className="wrapper">

                {/*<!-- Pagination (show only those in use) -->
                <div className="grid-pagination top">
                    <button type="button" className="button blue">Prev {X} Rooms</button>
                </div>
                <div className="grid-pagination bottom">
                    <button type="button" className="button blue">Next {X} Rooms</button>
                </div> */}
            <NightlyDiaryRoomsListContainer/>

        </div>
    </div>
);
