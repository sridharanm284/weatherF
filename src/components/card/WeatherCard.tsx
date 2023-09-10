import React from "react";
import SunnyImg from "../../assets/vectos/sunny.png";
import RainyImg from "../../assets/vectos/rainy.png";
import CloudyImg from "../../assets/vectos/cloudy.png";
import "./_index.scss";

interface WeatherCardProps {
	typea: string;
	dataa: string;
}

const WeatherCardComponent: React.FC<WeatherCardProps> = ({ typea, dataa }) => {
	return (
		<div className="weather_card_container">
			{typea === "rainy" ? (
				<img src={RainyImg} alt="rainy" />
			) : typea === "sunny" ? (
				<img src={SunnyImg} alt="sunny" />
			) : typea === "cloudy" ? (
				<img src={CloudyImg} alt="cloudy" />
			) : (
				<img src={SunnyImg} alt="sunny" />
			)}
			<div className="title">
				{dataa}<sup>o</sup>F
			</div>
				<div className="des">
				{typea}
			</div>
		</div>
	);
};

export default WeatherCardComponent;