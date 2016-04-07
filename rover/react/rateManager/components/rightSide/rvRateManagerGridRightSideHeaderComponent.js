const RateManagerGridRightSideHeaderComponent = ({headerDataList}) => ( 
	<thead>
		<tr>
			{headerDataList.map( (headerData, index) => 
				<th className={headerData.headerClass} key={"header-data-" + index}>
					<div className={headerData.cellClass}>
						<span className={headerData.topLabelContainerClass}>
							{headerData.topLabel}
						</span>
						<span className={headerData.bottomLabelContainerClass}>
							{headerData.bottomLabel}
						</span>
					</div>
				</th>
			)}
		</tr>
	</thead>
)