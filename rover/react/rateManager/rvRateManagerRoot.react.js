const RateManagerRoot = (props) => {
    return (
	    <div className='calendar'>
			{props.type === 'NOT_CONFIGURED' ? <RateManagerNotConfigured/> : <RateManagerCalendarViewRoot/>}
		</div>
	);
};
