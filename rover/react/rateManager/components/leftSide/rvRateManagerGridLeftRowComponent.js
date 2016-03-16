const RateManagerGridLeftRowComponent = ({
	id,
	onClick,
	greyedOut,
	iconClassBeforeText,
	showIconBeforeText,
	textInIconArea,
	text,
	showArrowIcon,
	arrowDirection
}) => (
	<tr className='cell rate'>
		<td className='first-row force-align'>
			<a onClick={() => onClick(id) }>
				<span className={ 'name ' + (greyedOut ? 'gray' : '')}>
					<span className={iconClassBeforeText}
						style={{display: showIconBeforeText ? 'inline' : 'none'}}
						>
						{textInIconArea}
					</span>
					{text}
				</span>
				<span style={{display: showArrowIcon ? 'inline' : 'none'}} 
					className={'icons icon-double-arrow rotate-' + arrowDirection}/>
			</a>
		</td>

	</tr>
)