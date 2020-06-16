import React from "react";

import FDidYouKnowSection from "../../components/organisms/FDidYouKnowSection";

import CoverImg from "../../imgs/cover_img.svg";

const ExpCovidTracker = () => {
	return (
		<div className="f-content f-home">
			{/* <div className="f-home__section f-home__cover">
				<img
					className="f-home__cover-bg-img"
					src={CoverImg}
					alt="_blank"
				/>
				<div className="bx--row">
					<div className="f-home__cover-text-wrapper bx--offset-lg-6 bx--col-lg-6">
						<h1 className="f-cover-title">
							COVID-19 Expenditure Tracker
						</h1>
						<h4 className="f-cover-subtitle">
							The Covid-19 tracker is an exclusive addition to
							this tool where citizens can explore the initiatives
							taken up by the government of Himachal Pradesh
							during the COVID-19 Epidemic.
						</h4>
					</div>
				</div>
			</div> */}
			<iframe src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1t9sSeZyLFykxPpd3ep3-DioIHiEBpF5v2scdMSk7xN8&font=Default&lang=en&initial_zoom=2&height=750' width='100%' height='750' webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder='0'></iframe>
			<div className="f-home__section">
				<FDidYouKnowSection />
			</div>
		</div>
	);
};

export default ExpCovidTracker;
