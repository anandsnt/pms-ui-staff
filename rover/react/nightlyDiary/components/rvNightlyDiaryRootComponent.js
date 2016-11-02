const NightlyDiaryRootComponent = () => (
    <section id="diary-nightly" className="content diary-days-7" role="main">
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
     <div className="diary-nightly-sidebar">

        <div className="sidebar-options">
            <button type="button" className="button white active">

                <span className="count">5</span>
                Unassigned
            </button>
            <button type="button" className="button white">

                <span className="count">6</span>
                Filters
            </button>
        </div>
        <div className="sidebar-content diary-nightly-unassigned visible">

            <div className="sidebar-header">
                <h2>Unassigned</h2>
                <p>Drag & Drop to assign a room</p>
            </div>
            <div className="unassigned-labels">
                <div className="data">Name / Room Type</div>
                <div className="arrival">Arrival</div>
                <div className="nights">Nights</div>
            </div>
            <div className="unassigned-list scrollable">
                <div className="wrapper">
                    <div className="guest check-in">
                        <div className="data">
                            <strong className="name">SOUMYA CYRIAC</strong>
                             {/*<!-- If VIP, show: <span className="vip">VIP</span> --> */}
                            <span className="room">Deluxe Twin</span>
                        </div>
                        <div className="arrival">2017-05-12</div>
                        <div className="nights">3</div>
                    </div>
                    <div className="guest check-in">
                        <div className="data">
                            <strong className="name">SOUMYA CYRIAC</strong>
                             {/*<!-- If VIP, show: <span className="vip">VIP</span> --> */}
                            <span className="room">Deluxe Twin</span>
                        </div>
                        <div className="arrival">2017-05-18</div>
                        <div className="nights">2</div>
                    </div>

                </div>
            </div>
        </div>

        </div>
    </section>
);
