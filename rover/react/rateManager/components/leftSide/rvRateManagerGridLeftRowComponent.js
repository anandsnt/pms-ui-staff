const RateManagerGridLeftRowComponent = ({
	trClassName,
	tdClassName,
	name,
	onClick,
	index,	
	leftSpanClassName,
	showIconBeforeText,
	iconClassBeforeText,
	textInIconArea,
	leftSpanText,
	address,
	showRightSpan,
	rightSpanClassName,
	contractLabel,
	contractClass,
	accountName,
	showIndicator
}) => (
	<tr className={trClassName} onTouchEnd={(e) => onClick(e, index) } onClick={(e) => onClick(e, index) }>
		<td className={tdClassName}>
			<a title={name}>
			<span className={leftSpanClassName}>
				{  (textInIconArea == 'B' && showIndicator)?(<span className="base-rate-indicator">B</span>):''}
				{ (contractLabel !=='' && showIndicator)? (<span className={'contracted-rate-indicator ' + contractClass}>
	                {contractLabel}
				</span>):''}
 			{leftSpanText}
			</span>                                
			<span className={'contracted-rate-contract '+ contractClass}>{accountName}</span>
			<span className={'contracted-rate-address '+ contractClass}>{address}</span>
			<span className="icons icon-double-arrow rotate-right"></span>
            </a>
		</td>
	</tr>
)