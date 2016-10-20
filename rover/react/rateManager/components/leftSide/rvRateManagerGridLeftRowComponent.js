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
	accountName
}) => (
	<tr className={trClassName} onClick={(e) => onClick(e, index) }>
		<td className={tdClassName}>
			<a title={name}>
			<span className={leftSpanClassName}>
				<span className="base-rate-indicator">B</span>
				<span className={'contracted-rate-indicator ' + contractClass}>
	                {contractLabel}
				</span>
 			{leftSpanText}
			</span>                                
			<span className={'contracted-rate-contract '+ contractClass}>{accountName}</span>
			<span className={'contracted-rate-address '+ contractClass}>{address}</span>                              
			<span className="icons icon-double-arrow rotate-right"></span>
            </a>
		</td>
	</tr>
)