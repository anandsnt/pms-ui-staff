const RateManagerGridLeftRowComponent = ({
	trClassName,
	tdClassName,
	onClick,
	id,	
	leftSpanClassName,
	showIconBeforeText,
	iconClassBeforeText,
	textInIconArea,
	leftSpanText,
	showRightSpan,
	rightSpanClassName
}) => (
	<tr className={trClassName}>
		<td className={tdClassName}>
			<a onClick={() => onClick(id) }>
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