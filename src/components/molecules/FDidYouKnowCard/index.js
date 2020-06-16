import React from "react";
import { Row, Col } from "antd";
import "./_style.scss";

const data = [
	{
		heading: "Heading 1",
        text:"The Food and Civil services, Road and Transport services and Social justice and empowerment departments have seen substantial increases in spending during the months (April and May) when the state went into lock down"	
    },
	{
		heading: "Heading 2",
		text:"Food and civil services spent almost 28% of their allocated budget in the last two months, compared to 0.54% last year. Much of this (₹ 8000 lakhs) was spent on subsidies toward procurement of pulses (55% of its allocated budget)"
	},
	{
		heading: "Heading 3",
		text:"The department of social justice and Empowerment spent 19% of its total budget by the month of May - primarily on children's welfare schemes and pensions"
	},
	{
		heading: "Heading 4",
		text:"The government spent ₹ 50 crores spent toward children's welfare during the pandemic. This was an additional 25% increase compared to the last year"
	},
	{
		heading: "Heading 5 ",
		text:"Around 25% of the total allocated budget or about ₹ 197 crores was spent toward pensions during April and May by The department of social justice and empowerment"
	},
];

const FDidYouKnowCard = () => {
	return (
		<Row gutter={16}>
			{data.map((didYouKnow) => (
				<Col sm={24} md={8}>
					<div class="card-container against-humanity">
						<div class="card">
							<span className="card-text">{didYouKnow.text}</span>
						</div>
					</div>
				</Col>
			))}
		</Row>
	);
};

export default FDidYouKnowCard;
