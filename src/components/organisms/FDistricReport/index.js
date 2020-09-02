import React, { useState } from "react";
import { Select } from "antd";
import { Event32, Events32, Receipt32, Flash32 } from "@carbon/icons-react";

import "./_style.scss";

const districts = [
	{ label: "BILASPUR", value: "BILASPUR" },
	{ label: "CHAMBA", value: "CHAMBA" },
	{ label: "HAMIRPUR", value: "HAMIRPUR" },
	{ label: "KANGRA", value: "KANGRA" },
	{ label: "KINNAUR", value: "KINNAUR" },
	{ label: "KULLU", value: "KULLU" },
	{ label: "LAHAUL AND SPITI", value: "LAHAUL & SPITI" },
	{ label: "MANDI", value: "MANDI" },
	{ label: "SHIMLA", value: "SHIMLA" },
	{ label: "SIRMAUR", value: "SIRMAUR" },
	{ label: "SOLAN", value: "SOLAN" },
	{ label: "UNA", value: "UNA" },
];

const capitalize = (val) => {
	return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
};

const DistrictReport = (props) => {
	const [activeDistrict, setActiveDistrict] = useState("BILASPUR");
	return (
		<div className="procurement-report-wrapper">
			<div className="container">
				<Select
					defaultValue="BILASPUR"
					options={districts}
					onChange={(val) => setActiveDistrict(val)}
					style={{ width: "200px" }}
				/>
				{Object.keys(props.districtReport).length ? (
					<div style={{ margin: "25px 0px" }}>
						<div className="d-flex justfy-flex-end">
							<div className="left-column w-50">
								<h2>
									{capitalize(activeDistrict)} in Perspective
								</h2>
								<h5>
									{capitalize(activeDistrict)}’s health
									procurement performance compared to other
									districts in Himachal
								</h5>
								<p>
									<span
										style={{
											fontSize: "16px",
											color: "white",
											fontWeight: "normal",
											textDecoration: "none",
											fontStyle: "italic",
											texttextDecorationSkipInk: "none",
										}}
									>
									All the values are on the scale of 0 to 1
									</span>
								</p>
								<div className="performance-indicators">
									<p>
										<Flash32 /> Process Efficiency :{" "}
										{
											props.districtReport[
												activeDistrict
											][
												"Procurement Process Efficiency Index"
											]
										}
									</p>
									<p>
										<Event32 /> Fiscal Planning :{" "}
										{
											props.districtReport[
												activeDistrict
											]["Participation Promotion Index"]
										}
									</p>
									<p>
										<Events32 /> Participation Promotion :{" "}
										{
											props.districtReport[
												activeDistrict
											]["Fiscal Planning Index"]
										}
									</p>
									<p className="text-bold">
										<Receipt32 /> Overall :{" "}
										{
											props.districtReport[
												activeDistrict
											]["Total"]
										}
									</p>
								</div>
							</div>
							<div className="right-column">
								<p>
									{
										props.districtReport[activeDistrict][
											"Report Card"
										]
									}
								</p>
							</div>
						</div>
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
};

export default DistrictReport;