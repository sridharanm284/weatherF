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
                  "storm_track_id": 411,
                  "storm_name": "TD 28W",
                  "storm_description": null,
                  "status_id": 8,
                  "created_by": 22,
                  "created_on": "2024-12-22",
                  "updated_by": null,
                  "updated_on": null,
                  "last_accessed_on": "2024-12-22T15:08:19.009623"
              }
          ],
          "storm_datas": [
              [
                  {
                      "storm_path_data_id": 39387,
                      "storm_path_id": 5154,
                      "id_index": 1,
                      "lat": 11.7,
                      "lon": 112.18,
                      "date_utc": "2024-12-23T03:00:00",
                      "time_utc": "2024-12-23T03:00:00",
                      "heading": 306.3441707869251,
                      "speed_kts": 3.04,
                      "max_wind_speed": 35.0,
                      "max_gust": 50.0,
                      "central_pressure": 999.0,
                      "output_unit_id": 24,
                      "kts_34_ne": 100.0,
                      "kts_34_se": 100.0,
                      "kts_34_sw": 100.0,
                      "kts_34_nw": 100.0,
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
                      "created_by": 25,
                      "created_on": "2024-12-24T00:56:11.591326",
                      "updated_by": 25,
                      "updated_on": "2024-12-23T01:01:21.524461",
                      "distance_in_miles": 36.472009936224886,
                      "storm_category_id": 2,
                      "last_accessed_on": "2024-12-23T01:00:16.175574"
                  },
                  {
                      "storm_path_data_id": 39388,
                      "storm_path_id": 5154,
                      "id_index": 2,
                      "lat": 12.06,
                      "lon": 111.68,
                      "date_utc": "2024-12-23T15:00:00",
                      "time_utc": "2024-12-23T15:00:00",
                      "heading": 288.8292214520492,
                      "speed_kts": 3.41,
                      "max_wind_speed": 35.0,
                      "max_gust": 50.0,
                      "central_pressure": 998.0,
                      "output_unit_id": 24,
                      "kts_34_ne": 120.0,
                      "kts_34_se": 120.0,
                      "kts_34_sw": 120.0,
                      "kts_34_nw": 120.0,
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
                      "created_by": 25,
                      "created_on": "2024-12-24T00:56:11.591326",
                      "updated_by": 25,
                      "updated_on": "2024-12-23T01:01:21.524461",
                      "distance_in_miles": 40.926301560695485,
                      "storm_category_id": 2,
                      "last_accessed_on": "2024-12-23T01:00:16.175574"
                  },
                  {
                      "storm_path_data_id": 39389,
                      "storm_path_id": 5154,
                      "id_index": 3,
                      "lat": 12.28,
                      "lon": 111.02,
                      "date_utc": "2024-12-24T03:00:00",
                      "time_utc": "2024-12-24T03:00:00",
                      "heading": 257.9979742109428,
                      "speed_kts": 3.85,
                      "max_wind_speed": 35.0,
                      "max_gust": 50.0,
                      "central_pressure": 997.0,
                      "output_unit_id": 24,
                      "kts_34_ne": 90.0,
                      "kts_34_se": 90.0,
                      "kts_34_sw": 90.0,
                      "kts_34_nw": 90.0,
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
                      "created_by": 25,
                      "created_on": "2024-12-24T00:56:11.591326",
                      "updated_by": 25,
                      "updated_on": "2024-12-23T01:01:21.524461",
                      "distance_in_miles": 46.19689944369321,
                      "storm_category_id": 2,
                      "last_accessed_on": "2024-12-23T01:00:16.175574"
                  },
                  {
                      "storm_path_data_id": 39390,
                      "storm_path_id": 5154,
                      "id_index": 4,
                      "lat": 12.12,
                      "lon": 110.25,
                      "date_utc": "2024-12-24T15:00:00",
                      "time_utc": "2024-12-24T15:00:00",
                      "heading": 248.48237884462839,
                      "speed_kts": 6.68,
                      "max_wind_speed": 30.0,
                      "max_gust": 40.0,
                      "central_pressure": 999.0,
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
                      "created_by": 25,
                      "created_on": "2024-12-24T00:56:11.591326",
                      "updated_by": 25,
                      "updated_on": "2024-12-23T01:01:21.524461",
                      "distance_in_miles": 80.20948232807687,
                      "storm_category_id": 2,
                      "last_accessed_on": "2024-12-23T01:00:16.175574"
                  },
                  {
                      "storm_path_data_id": 39391,
                      "storm_path_id": 5154,
                      "id_index": 5,
                      "lat": 11.63,
                      "lon": 108.98,
                      "date_utc": "2024-12-25T03:00:00",
                      "time_utc": "2024-12-25T03:00:00",
                      "heading": 248.6089365309726,
                      "speed_kts": 6.58,
                      "max_wind_speed": 25.0,
                      "max_gust": 35.0,
                      "central_pressure": 1001.0,
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
                      "created_by": 25,
                      "created_on": "2024-12-24T00:56:11.591326",
                      "updated_by": 25,
                      "updated_on": "2024-12-23T01:01:21.524461",
                      "distance_in_miles": 79.01542527557218,
                      "storm_category_id": 59,
                      "last_accessed_on": "2024-12-23T01:00:16.175574"
                  },
                  {
                      "storm_path_data_id": 39392,
                      "storm_path_id": 5154,
                      "id_index": 6,
                      "lat": 11.15,
                      "lon": 107.73,
                      "date_utc": "2024-12-25T15:00:00",
                      "time_utc": "2024-12-25T15:00:00",
                      "heading": 246.40346725512342,
                      "speed_kts": 0.0,
                      "max_wind_speed": 20.0,
                      "max_gust": 30.0,
                      "central_pressure": 1003.0,
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
                      "created_by": 25,
                      "created_on": "2024-12-24T00:56:11.591326",
                      "updated_by": 25,
                      "updated_on": "2024-12-23T01:01:21.524461",
                      "distance_in_miles": 44.997317294426885,
                      "storm_category_id": 59,
                      "last_accessed_on": "2024-12-23T01:00:16.175574"
                  }
              ]
          ],
          "map_hovers": {
              "storm_411": {
                  "lat": 11.7,
                  "lon": 112.18
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
      
        const lastEditedData ={"forecast": "2024-10-30T00:00:00", "quick_overview": null, "typhoon": "2024-10-23"};

        
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


