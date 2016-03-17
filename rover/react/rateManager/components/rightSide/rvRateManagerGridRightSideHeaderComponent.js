const RateManagerGridRightSideHeaderComponent = ({ headerDataList }) => (
	<thead>
		<tr>
			{headerDataList.map( headerData => 
				<th className={headerData.headerClass}>
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
);