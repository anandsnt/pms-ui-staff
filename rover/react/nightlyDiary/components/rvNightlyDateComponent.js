const NightlyDiaryDatesComponent = ({ datesToComponent, isSevenModeChosen  }) => {

    if(isSevenModeChosen) {

        return (

                <div className="grid-dates"> {/* <!-- Timeline -->*/}
                    {/*_content/timeline.html*/}

                    {
                        datesToComponent.map((item, index) =>

                            <div className="day">
                                <span>{item.day}</span>
                                <strong>{item.month+' '+item.dateValue}</strong>
                            </div>

                        )
                    }

                </div>



        )
    } else {
        return (

                <div className="grid-dates"> {/* <!-- Timeline -->*/}

                </div>



        )
    }

};


