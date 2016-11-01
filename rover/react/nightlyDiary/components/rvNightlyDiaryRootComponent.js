const NightlyDiaryRootComponent = () => (
    <div className="diary-nightly-main">
        {/*This will be moved to another component*/}
        <div className="grid-timeline">
             {/*<!-- Room Search -->*/}
            <div className="grid-room-search">
                <button className="clear-query visible">
                 {/*<!-- Add className 'visible' when searching. Tap clears L33 value and removes search. -->*/}
                    <span className="icons icon-clear-search">Clear query</span>
                </button>
             {/* <!-- Add className .hidden when edit screen is displayed -->*/}
                <input type="text" placeholder="Go to Room No." value="" />
            </div>
            <NightlyDiaryDatesContainer/>
        </div>
        <div id="diary-nightly-grid" className="grid-content scrollable top-pagination">
            <div className="wrapper">

                {/*<!-- Pagination (show only those in use) -->*/}
                <div className="grid-pagination top">
                    <button type="button" className="button blue">Prev 6 Rooms</button>
                </div>
                <div className="grid-pagination bottom">
                    <button type="button" className="button blue">Next 10 Rooms</button>
                </div>

                {/*<!-- Rooms -->*/}

                <NightlyDiaryRoomsListContainer/>


                {/*<!-- Grid -->*/}
                <div className="grid-reservations firstday-wed">

                </div>
            </div>
        </div>

    </div>
);
