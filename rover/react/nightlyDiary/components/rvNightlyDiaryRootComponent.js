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
            {/* <!-- Timeline -->*/}
            <div className="grid-dates">
                {/*_content/timeline.html*/}
                <div className="day">
                    <span>Sunday</span>
                    <strong>October 16</strong>
                </div>
                <div className="day">
                    <span>Sunday</span>
                    <strong>October 16</strong>
                </div>
                <div className="day">
                    <span>Sunday</span>
                    <strong>October 16</strong>
                </div>
                <div className="day">
                    <span>Sunday</span>
                    <strong>October 16</strong>
                </div>
                <div className="day">
                    <span>Sunday</span>
                    <strong>October 16</strong>
                </div>
                <div className="day">
                    <span>Sunday</span>
                    <strong>October 16</strong>
                </div>
                <div className="day">
                    <span>Sunday</span>
                    <strong>October 16</strong>
                </div>
            </div>

            {/* <!-- Stay Range | Remove .hidden to show-->*/}
            <div className="grid-stay-range hidden">
                {/*_content/stay-range.html*/}
            </div>
        </div>

        <NightlyDiaryRoomsListContainer/>
    </div>
);
