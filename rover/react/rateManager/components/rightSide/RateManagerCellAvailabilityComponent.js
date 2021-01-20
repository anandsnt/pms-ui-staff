const RateManagerCellAvailabilityComponent = ({availability}) => (
    <span className={'cell-availability ' + (availability < 1 ? 'red' : '')}>
        {availability}
    </span>
);