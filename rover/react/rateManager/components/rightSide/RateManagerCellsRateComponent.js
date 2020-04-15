const RateManagerCellsRateComponent = ({amount}) => (
	<span className='rate-single'>
		{
			amount ? (
				<span className="rate-single-text">From</span>
			) : (
				''
			)
		}
		{amount}
	</span>	
);