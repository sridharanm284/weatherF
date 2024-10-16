import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import squall from "./../../assets/squall.png";
import typhoon from "./../../assets/typhoon.png";
import forecast from "./../../assets/forecast.png";
import lightning from "./../../assets/lightning.png";
import quickOverview from "./../../assets/quick-overview.png";
import weatherWindow from "./../../assets/weather-window.png";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
import "./style.scss";
import Map from "../MapComponent"
import axios from "axios";

interface CardData {
  name: string;
  url: string;
  image: string;
  content: string;
  color?: string;
}

const CardPlan: React.FC = () => {
  const [data, setData] = useState<CardData[]>([]);
  const [stormData, setStormData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStormData();
    fetchLastEditedData();
  }, []);

  const fetchStormData = () => {
 
    const hardcodedData = {
         "track_datas": [
             {
                 "storm_track_id": 383,
                 "storm_name": "11W SHANSHAN",
                 "storm_description": null,
                 "status_id": 8,
                 "created_by": 22,
                 "created_on": "2024-08-21",
                 "updated_by": 20,
                 "updated_on": "2024-08-22",
                 "last_accessed_on": "2024-08-22T09:03:45.837175"
             }
         ],
         "storm_datas": [
             [
                 {
                     "storm_path_data_id": 35677,
                     "storm_path_id": 4668,
                     "id_index": 1,
                     "lat": 33.5,
                     "lon": 131.1,
                     "date_utc": "2024-08-29T18:00:00",
                     "time_utc": "2024-08-29T18:00:00",
                     "heading": 69.19205442858083,
                     "speed_kts": 4.37,
                     "max_wind_speed": 50.0,
                     "max_gust": 65.0,
                     "central_pressure": 963.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 110.0,
                     "kts_34_se": 110.0,
                     "kts_34_sw": 110.0,
                     "kts_34_nw": 110.0,
                     "kts_50_ne": 40.0,
                     "kts_50_se": 40.0,
                     "kts_50_sw": 40.0,
                     "kts_50_nw": 40.0,
                     "kts_64_ne": 20.0,
                     "kts_64_se": 20.0,
                     "kts_64_sw": 20.0,
                     "kts_64_nw": 20.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 52.39477537444778,
                     "storm_category_id": 61,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 },
                 {
                     "storm_path_data_id": 35672,
                     "storm_path_id": 4668,
                     "id_index": 2,
                     "lat": 33.81,
                     "lon": 132.08,
                     "date_utc": "2024-08-30T06:00:00",
                     "time_utc": "2024-08-30T06:00:00",
                     "heading": 86.80530785739427,
                     "speed_kts": 6.28,
                     "max_wind_speed": 45.0,
                     "max_gust": 55.0,
                     "central_pressure": 972.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 80.0,
                     "kts_34_se": 80.0,
                     "kts_34_sw": 80.0,
                     "kts_34_nw": 80.0,
                     "kts_50_ne": 30.0,
                     "kts_50_se": 30.0,
                     "kts_50_sw": 30.0,
                     "kts_50_nw": 30.0,
                     "kts_64_ne": 0.0,
                     "kts_64_se": 0.0,
                     "kts_64_sw": 0.0,
                     "kts_64_nw": 0.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 75.41551572138704,
                     "storm_category_id": 2,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 },
                 {
                     "storm_path_data_id": 35673,
                     "storm_path_id": 4668,
                     "id_index": 3,
                     "lat": 33.88,
                     "lon": 133.59,
                     "date_utc": "2024-08-30T18:00:00",
                     "time_utc": "2024-08-30T18:00:00",
                     "heading": 88.4833884891782,
                     "speed_kts": 3.78,
                     "max_wind_speed": 35.0,
                     "max_gust": 45.0,
                     "central_pressure": 987.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 60.0,
                     "kts_34_se": 60.0,
                     "kts_34_sw": 60.0,
                     "kts_34_nw": 60.0,
                     "kts_50_ne": 0.0,
                     "kts_50_se": 0.0,
                     "kts_50_sw": 0.0,
                     "kts_50_nw": 0.0,
                     "kts_64_ne": 0.0,
                     "kts_64_se": 0.0,
                     "kts_64_sw": 0.0,
                     "kts_64_nw": 0.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 45.370439546372374,
                     "storm_category_id": 2,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 },
                 {
                     "storm_path_data_id": 35674,
                     "storm_path_id": 4668,
                     "id_index": 4,
                     "lat": 33.9,
                     "lon": 134.5,
                     "date_utc": "2024-08-31T06:00:00",
                     "time_utc": "2024-08-31T06:00:00",
                     "heading": 77.18582834271024,
                     "speed_kts": 2.26,
                     "max_wind_speed": 30.0,
                     "max_gust": 40.0,
                     "central_pressure": 991.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 0.0,
                     "kts_34_se": 0.0,
                     "kts_34_sw": 0.0,
                     "kts_34_nw": 0.0,
                     "kts_50_ne": 0.0,
                     "kts_50_se": 0.0,
                     "kts_50_sw": 0.0,
                     "kts_50_nw": 0.0,
                     "kts_64_ne": 0.0,
                     "kts_64_se": 0.0,
                     "kts_64_sw": 0.0,
                     "kts_64_nw": 0.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 27.07089682593226,
                     "storm_category_id": 2,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 },
                 {
                     "storm_path_data_id": 35675,
                     "storm_path_id": 4668,
                     "id_index": 5,
                     "lat": 34.0,
                     "lon": 135.03,
                     "date_utc": "2024-08-31T18:00:00",
                     "time_utc": "2024-08-31T18:00:00",
                     "heading": 75.59800741740617,
                     "speed_kts": 2.01,
                     "max_wind_speed": 25.0,
                     "max_gust": 35.0,
                     "central_pressure": 991.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 0.0,
                     "kts_34_se": 0.0,
                     "kts_34_sw": 0.0,
                     "kts_34_nw": 0.0,
                     "kts_50_ne": 0.0,
                     "kts_50_se": 0.0,
                     "kts_50_sw": 0.0,
                     "kts_50_nw": 0.0,
                     "kts_64_ne": 0.0,
                     "kts_64_se": 0.0,
                     "kts_64_sw": 0.0,
                     "kts_64_nw": 0.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 24.139431890743662,
                     "storm_category_id": 59,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 },
                 {
                     "storm_path_data_id": 35676,
                     "storm_path_id": 4668,
                     "id_index": 6,
                     "lat": 34.1,
                     "lon": 135.5,
                     "date_utc": "2024-09-01T06:00:00",
                     "time_utc": "2024-09-01T06:00:00",
                     "heading": 224.39376580569265,
                     "speed_kts": 0.0,
                     "max_wind_speed": 20.0,
                     "max_gust": 30.0,
                     "central_pressure": 991.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 0.0,
                     "kts_34_se": 0.0,
                     "kts_34_sw": 0.0,
                     "kts_34_nw": 0.0,
                     "kts_50_ne": 0.0,
                     "kts_50_se": 0.0,
                     "kts_50_sw": 0.0,
                     "kts_50_nw": 0.0,
                     "kts_64_ne": 0.0,
                     "kts_64_se": 0.0,
                     "kts_64_sw": 0.0,
                     "kts_64_nw": 0.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 54.63419482661779,
                     "storm_category_id": 59,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 }
             ]
         ],
         "map_hovers": {
             "storm_383": {
                 "lat": 33.5,
                 "lon": 131.1
             }
         }
      }
    setStormData(hardcodedData.storm_datas[0]);
    console.log("Storm data set:", hardcodedData.storm_datas[0]);
  };

  const returnTimeDifference = (date: string) => {
    const now = new Date();
    const pastDate = new Date(date);
    const timeDiff = Math.abs(now.getTime() - pastDate.getTime());
    const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    return diffDays + " days";
  };

  const fetchLastEditedData = async () => {
    const fid = '1792'; 
    if (fid) {
      try {
        console.log("Fetching last edited data");
      
        const lastEditedData = {"forecast": "2024-09-03T21:00:00", "quick_overview": "2024-08-26T14:49:48.314", "typhoon": "2024-08-28T09:52:09.670"};

        const cardData: CardData[] = [
          {
            name: "Forecast",
            url: "forecast",
            image: forecast,
            content: lastEditedData.forecast
              ? `Last edited ${returnTimeDifference(lastEditedData.forecast)} ago`
              : "",
          },
          {
            name: "Quick Overview",
            url: "overview",
            image: quickOverview,
            content: lastEditedData.quick_overview
              ? `Last edited ${returnTimeDifference(lastEditedData.quick_overview)} ago`
              : "",
          },
          {
            name: "Weather Window",
            url: "weather",
            image: weatherWindow,
            content: lastEditedData.quick_overview
              ? `Last edited ${returnTimeDifference(lastEditedData.quick_overview)} ago`
              : "",
          },
          {
            name: "Squall",
            url: "squall",
            image: squall,
            content: "",
            color: "green",
          },
          {
            name: "Typhoon",
            url: "typhoon",
            image: typhoon,
            content: lastEditedData.typhoon
              ? `Last edited ${returnTimeDifference(lastEditedData.typhoon)} ago`
              : "",
            color: stormData.length === 0 ? "green" : "red",
          },
          {
            name: "Lightning",
            url: "lightning",
            image: lightning,
            content: "",
            color: "green",
          },
        ];

        setData(cardData);
        console.log("Card data set:", cardData);
      } catch (error) {
        console.error("Error fetching last edited data:", error);
      }
    } else {
      console.log("No fid found");
  
      const defaultCardData: CardData[] = [
        {
          name: "Forecast",
          url: "forecast",
          image: forecast,
          content: "No data available",
        },
        {
          name: "Quick Overview",
          url: "overview",
          image: quickOverview,
          content: "No data available",
        },
        {
          name: "Weather Window",
          url: "weather",
          image: weatherWindow,
          content: "No data available",
        },
        {
          name: "Squall",
          url: "squall",
          image: squall,
          content: "",
          color: "green",
        },
        {
          name: "Typhoon",
          url: "typhoon",
          image: typhoon,
          content: "No data available",
          color: "green",
        },
        {
          name: "Lightning",
          url: "lightning",
          image: lightning,
          content: "",
          color: "green",
        },
      ];

      setData(defaultCardData);
      console.log("Default card data set:", defaultCardData);
    }
  };



  return (
    <div className="container">
      <div className="map-container">
        <Map />
      </div>
      <div className="cards-container">
        <Grid container direction="row" wrap="nowrap" spacing={8} className="cards-grid">
          {data.map((item) => (
            <Grid item key={item.name} xs>
              <Link to={`/${item.url}`} state={{ title: item.name }}>
                <div className="hoverable">
                  <CardMedia
                    className="card-img"
                    sx={{ height: 100 , width: 200 }}
                    image={item.image}
                    title={item.name}
                    style={{ borderRadius: "10px" }}
                  />
                  <Card className="parent_card" style={{ borderRadius: "10px" }}>
                    <CardContent
                      className="child_card"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <Typography gutterBottom variant="h6" component="div">
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {item.content}
                        </Typography>
                      </div>
                      {item.color && (
                        <span
                          className={`color_icon ${
                            item.color === "red"
                              ? "color_icon_red blinking-circle"
                              : `color_icon_${item.color}`
                          }`}
                        ></span>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default CardPlan;


