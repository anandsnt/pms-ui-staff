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
	showRightSpan,
	rightSpanClassName,
	showIndicator
}) => (
	<tr className={trClassName} onTouchEnd={(e) => onClick(e, index) } onClick={(e) => onClick(e, index) }>
		<td className={tdClassName}>
			<a title={name}>
			<span className={leftSpanClassName}>
				{  (textInIconArea == 'B' && showIndicator)?(<span className="base-rate-indicator">B</span>):''}
 			{leftSpanText}
			</span>
			<span className={rightSpanClassName}></span>
            </a>
		</td>
	</tr>
)
