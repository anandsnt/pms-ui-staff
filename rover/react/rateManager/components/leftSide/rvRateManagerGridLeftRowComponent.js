const RateManagerGridLeftRowComponent = ({
	trClassName,
	tdClassName,
	onClick,
	index,	
	leftSpanClassName,
	showIconBeforeText,
	iconClassBeforeText,
	textInIconArea,
	leftSpanText,
	showRightSpan,
	rightSpanClassName
}) => (
	<tr className={trClassName} onClick={(e) => onClick(e, index) }>
		<td className={tdClassName}>
			<a>
				<span className={leftSpanClassName}>
					{
						showIconBeforeText ? (<span className={iconClassBeforeText}> {textInIconArea} </span>) : ''
					}
					{leftSpanText}
				</span>
				{
					showRightSpan ? (<span className={rightSpanClassName}/>) : ''
				}
			</a>
		</td>
	</tr>
)