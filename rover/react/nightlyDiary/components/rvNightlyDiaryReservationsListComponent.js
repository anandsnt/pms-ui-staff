const NightlyDiaryReservationsListComponent = ({ reservationsListToComponent }) => {

    (<div className="grid-reservations firstday-fri">

        {
            reservationsListToComponent.map((item) => (
                    <div className="grid-row">
                        {
                            //if(item.reservations.length > 0) {
                                item.reservations.map((reservationItem) => (
                                        <div>
                                            fffffffffffffffxxx
                                        </div>
                                    )
                                )

                            //}

                        }
                    </div>
                )
            )
        }
    </div>);
};


const { PropTypes } = React;

NightlyDiaryReservationsListComponent.propTypes = {
  reservationsListToComponent: PropTypes.array.isRequired
}