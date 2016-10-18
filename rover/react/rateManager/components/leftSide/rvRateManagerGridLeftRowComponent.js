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
	showDetails
}) => (
	<tr className={trClassName} onClick={(e) => onClick(e, index) }>
		<td className={tdClassName}>
			<a title={name}>
				<span className={leftSpanClassName}>
					{
						showIconBeforeText ? (<span className={iconClassBeforeText}> {textInIconArea} </span>) : ''
					}					
					{showDetails?(<span className={contractClass}>
                        {contractLabel}
                    </span>):''
                	}
                    {leftSpanText}
				</span>
				{
					showDetails?(<span className={contractClass}>{accountName}</span>):''
				}
                {
                	showDetails?(<span className={contractClass}>{address}</span>):''
                }
				{
					showRightSpan ? (<span className={rightSpanClassName}/>) : ''
				}
			</a>
		</td>
	</tr>
)