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
 
    const hardcodedData = {"track_datas": [{"storm_track_id": 398,"storm_name": "22W TRAMI","storm_description": null,"status_id": 8,"created_by": 23,"created_on": "2024-10-20","updated_by": 20,"updated_on": "2024-10-21","last_accessed_on": "2024-10-21T22:03:19.368894"},{"storm_track_id": 397,"storm_name": "INV 98B","storm_description": null,"status_id": 8,"created_by": 18,"created_on": "2024-10-17","updated_by": 18,"updated_on": "2024-10-19","last_accessed_on": "2024-10-19T21:30:01.410662"}],"storm_datas": [[{"storm_path_data_id": 37271,"storm_path_id": 4889,"id_index": 10,"lat": 16.9,"lon": 107.5,"date_utc": "2024-10-27T18:00:00","time_utc": "2024-10-27T18:00:00","heading": 274.409875874797,"speed_kts": 0.0,"max_wind_speed": 40.0,"max_gust": 60.0,"central_pressure": 994.0,"output_unit_id": 24,"kts_34_ne": 120.0,"kts_34_se": 120.0,"kts_34_sw": 120.0,"kts_34_nw": 120.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 20,"created_on": "2024-10-23T12:02:37.571534","updated_by": 20,"updated_on": "2024-10-23T04:05:21.227922","distance_in_miles": 54.65969045180493,"storm_category_id": 2,"last_accessed_on": "2024-10-23T04:05:21.227256"},{"storm_path_data_id": 37263,"storm_path_id": 4889,"id_index": 9,"lat": 17.096854595982553,"lon": 109.35524805884876,"date_utc": "2024-10-27T06:00:00","time_utc": "2024-10-27T06:00:00","heading": 263.66868737837103,"speed_kts": 8.93,"max_wind_speed": 50.0,"max_gust": 65.0,"central_pressure": 987.0,"output_unit_id": 24,"kts_34_ne": 130.0,"kts_34_se": 130.0,"kts_34_sw": 130.0,"kts_34_nw": 130.0,"kts_50_ne": 40.0,"kts_50_se": 40.0,"kts_50_sw": 40.0,"kts_50_nw": 40.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 20,"created_on": "2024-10-23T12:02:37.571534","updated_by": 20,"updated_on": "2024-10-23T04:05:21.227922","distance_in_miles": 107.17725422617013,"storm_category_id": 61,"last_accessed_on": "2024-10-23T04:05:21.227256"},{"storm_path_data_id": 37270,"storm_path_id": 4889,"id_index": 8,"lat": 17.3,"lon": 111.15528305701255,"date_utc": "2024-10-26T18:00:00","time_utc": "2024-10-26T18:00:00","heading": 263.2623726132974,"speed_kts": 8.66,"max_wind_speed": 60.0,"max_gust": 75.0,"central_pressure": 981.0,"output_unit_id": 24,"kts_34_ne": 140.0,"kts_34_se": 140.0,"kts_34_sw": 140.0,"kts_34_nw": 140.0,"kts_50_ne": 40.0,"kts_50_se": 40.0,"kts_50_sw": 40.0,"kts_50_nw": 40.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 20,"created_on": "2024-10-23T12:02:37.571534","updated_by": 20,"updated_on": "2024-10-23T04:05:21.227922","distance_in_miles": 103.96041917536836,"storm_category_id": 61,"last_accessed_on": "2024-10-23T04:05:21.227256"},{"storm_path_data_id": 37265,"storm_path_id": 4889,"id_index": 7,"lat": 17.25332461455549,"lon": 112.85479390521435,"date_utc": "2024-10-26T06:00:00","time_utc": "2024-10-26T06:00:00","heading": 271.64746907078523,"speed_kts": 8.12,"max_wind_speed": 60.0,"max_gust": 75.0,"central_pressure": 980.0,"output_unit_id": 24,"kts_34_ne": 140.0,"kts_34_se": 140.0,"kts_34_sw": 140.0,"kts_34_nw": 140.0,"kts_50_ne": 40.0,"kts_50_se": 40.0,"kts_50_sw": 40.0,"kts_50_nw": 40.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 20,"created_on": "2024-10-23T12:02:37.571534","updated_by": 20,"updated_on": "2024-10-23T04:05:21.227922","distance_in_miles": 97.47586811010574,"storm_category_id": 61,"last_accessed_on": "2024-10-23T04:05:21.227256"},{"storm_path_data_id": 37266,"storm_path_id": 4889,"id_index": 6,"lat": 17.178117191845466,"lon": 114.5,"date_utc": "2024-10-25T18:00:00","time_utc": "2024-10-25T18:00:00","heading": 272.73992580038515,"speed_kts": 7.87,"max_wind_speed": 60.0,"max_gust": 70.0,"central_pressure": 984.0,"output_unit_id": 24,"kts_34_ne": 180.0,"kts_34_se": 180.0,"kts_34_sw": 180.0,"kts_34_nw": 180.0,"kts_50_ne": 50.0,"kts_50_se": 50.0,"kts_50_sw": 50.0,"kts_50_nw": 50.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 20,"created_on": "2024-10-23T12:02:37.571534","updated_by": 20,"updated_on": "2024-10-23T04:05:21.227922","distance_in_miles": 94.4613319835105,"storm_category_id": 61,"last_accessed_on": "2024-10-23T04:05:21.227256"},{"storm_path_data_id": 37264,"storm_path_id": 4889,"id_index": 5,"lat": 17.052904846605067,"lon": 116.35510615012801,"date_utc": "2024-10-25T06:00:00","time_utc": "2024-10-25T06:00:00","heading": 274.03973581821083,"speed_kts": 8.89,"max_wind_speed": 55.0,"max_gust": 65.0,"central_pressure": 986.0,"output_unit_id": 24,"kts_34_ne": 200.0,"kts_34_se": 200.0,"kts_34_sw": 200.0,"kts_34_nw": 200.0,"kts_50_ne": 50.0,"kts_50_se": 50.0,"kts_50_sw": 50.0,"kts_50_nw": 50.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 20,"created_on": "2024-10-23T12:02:37.571534","updated_by": 20,"updated_on": "2024-10-23T04:05:21.227922","distance_in_miles": 106.71382685156698,"storm_category_id": 61,"last_accessed_on": "2024-10-23T04:05:21.227256"},{"storm_path_data_id": 37267,"storm_path_id": 4889,"id_index": 4,"lat": 16.8630008111902,"lon": 118.19002187557642,"date_utc": "2024-10-24T18:00:00","time_utc": "2024-10-24T18:00:00","heading": 276.17534280762294,"speed_kts": 8.83,"max_wind_speed": 50.0,"max_gust": 65.0,"central_pressure": 987.0,"output_unit_id": 24,"kts_34_ne": 200.0,"kts_34_se": 200.0,"kts_34_sw": 200.0,"kts_34_nw": 200.0,"kts_50_ne": 50.0,"kts_50_se": 50.0,"kts_50_sw": 50.0,"kts_50_nw": 50.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 20,"created_on": "2024-10-23T12:02:37.571534","updated_by": 20,"updated_on": "2024-10-23T04:05:21.227922","distance_in_miles": 105.99390780887576,"storm_category_id": 61,"last_accessed_on": "2024-10-23T04:05:21.227256"},{"storm_path_data_id": 37269,"storm_path_id": 4889,"id_index": 3,"lat": 16.72337093719092,"lon": 119.92456743631504,"date_utc": "2024-10-24T06:00:00","time_utc": "2024-10-24T06:00:00","heading": 274.80642847742405,"speed_kts": 8.34,"max_wind_speed": 45.0,"max_gust": 55.0,"central_pressure": 989.0,"output_unit_id": 24,"kts_34_ne": 180.0,"kts_34_se": 180.0,"kts_34_sw": 180.0,"kts_34_nw": 180.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 20,"created_on": "2024-10-23T12:02:37.571534","updated_by": 20,"updated_on": "2024-10-23T04:05:21.227922","distance_in_miles": 100.05342815345773,"storm_category_id": 2,"last_accessed_on": "2024-10-23T04:05:21.227256"},{"storm_path_data_id": 37268,"storm_path_id": 4889,"id_index": 2,"lat": 16.8,"lon": 121.5,"date_utc": "2024-10-23T18:00:00","time_utc": "2024-10-23T18:00:00","heading": 267.0919709418789,"speed_kts": 7.56,"max_wind_speed": 45.0,"max_gust": 55.0,"central_pressure": 990.0,"output_unit_id": 24,"kts_34_ne": 180.0,"kts_34_se": 180.0,"kts_34_sw": 180.0,"kts_34_nw": 180.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 20,"created_on": "2024-10-23T12:02:37.571534","updated_by": 20,"updated_on": "2024-10-23T04:05:21.227922","distance_in_miles": 90.68759209235948,"storm_category_id": 2,"last_accessed_on": "2024-10-23T04:05:21.227256"},{"storm_path_data_id": 37272,"storm_path_id": 4889,"id_index": 1,"lat": 16.172005589122254,"lon": 123.42467301705861,"date_utc": "2024-10-23T06:00:00","time_utc": "2024-10-23T06:00:00","heading": 288.79227458596097,"speed_kts": 9.75,"max_wind_speed": 45.0,"max_gust": 55.0,"central_pressure": 991.0,"output_unit_id": 24,"kts_34_ne": 180.0,"kts_34_se": 180.0,"kts_34_sw": 180.0,"kts_34_nw": 180.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 20,"created_on": "2024-10-23T12:02:37.571534","updated_by": 20,"updated_on": "2024-10-23T04:05:21.227922","distance_in_miles": 117.04631383256913,"storm_category_id": 2,"last_accessed_on": "2024-10-23T04:05:21.227256"}],[{"storm_path_data_id": 37260,"storm_path_id": 4888,"id_index": 8,"lat": 21.65,"lon": 84.8,"date_utc": "2024-10-26T00:00:00","time_utc": "2024-10-26T00:00:00","heading": 0.0,"speed_kts": 0.0,"max_wind_speed": 35.0,"max_gust": 45.0,"central_pressure": 999.0,"output_unit_id": 24,"kts_34_ne": 40.0,"kts_34_se": 40.0,"kts_34_sw": 40.0,"kts_34_nw": 40.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 25,"created_on": "2024-10-23T23:17:22.522434","updated_by": 20,"updated_on": "2024-10-23T03:17:11.677068","distance_in_miles": 0.0,"storm_category_id": 2,"last_accessed_on": "2024-10-23T03:17:11.670098"},{"storm_path_data_id": 37258,"storm_path_id": 4888,"id_index": 7,"lat": 21.35,"lon": 86.0,"date_utc": "2024-10-25T12:00:00","time_utc": "2024-10-25T12:00:00","heading": 285.0399665728904,"speed_kts": 5.78,"max_wind_speed": 50.0,"max_gust": 65.0,"central_pressure": 994.0,"output_unit_id": 24,"kts_34_ne": 70.0,"kts_34_se": 70.0,"kts_34_sw": 70.0,"kts_34_nw": 70.0,"kts_50_ne": 20.0,"kts_50_se": 20.0,"kts_50_sw": 20.0,"kts_50_nw": 20.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 25,"created_on": "2024-10-23T23:17:22.522434","updated_by": 20,"updated_on": "2024-10-23T03:17:11.677068","distance_in_miles": 69.4128691973487,"storm_category_id": 61,"last_accessed_on": "2024-10-23T03:17:11.670098"},{"storm_path_data_id": 37257,"storm_path_id": 4888,"id_index": 6,"lat": 20.8,"lon": 86.95,"date_utc": "2024-10-25T00:00:00","time_utc": "2024-10-25T00:00:00","heading": 301.81761408563847,"speed_kts": 5.22,"max_wind_speed": 60.0,"max_gust": 75.0,"central_pressure": 991.0,"output_unit_id": 24,"kts_34_ne": 100.0,"kts_34_se": 100.0,"kts_34_sw": 100.0,"kts_34_nw": 100.0,"kts_50_ne": 40.0,"kts_50_se": 40.0,"kts_50_sw": 40.0,"kts_50_nw": 40.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 25,"created_on": "2024-10-23T23:17:22.522434","updated_by": 20,"updated_on": "2024-10-23T03:17:11.677068","distance_in_miles": 62.63502208368932,"storm_category_id": 61,"last_accessed_on": "2024-10-23T03:17:11.670098"},{"storm_path_data_id": 37256,"storm_path_id": 4888,"id_index": 5,"lat": 19.8,"lon": 87.6,"date_utc": "2024-10-24T12:00:00","time_utc": "2024-10-24T12:00:00","heading": 328.63276510172926,"speed_kts": 5.86,"max_wind_speed": 60.0,"max_gust": 75.0,"central_pressure": 991.0,"output_unit_id": 24,"kts_34_ne": 100.0,"kts_34_se": 100.0,"kts_34_sw": 100.0,"kts_34_nw": 100.0,"kts_50_ne": 40.0,"kts_50_se": 40.0,"kts_50_sw": 40.0,"kts_50_nw": 40.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 25,"created_on": "2024-10-23T23:17:22.522434","updated_by": 20,"updated_on": "2024-10-23T03:17:11.677068","distance_in_miles": 70.3174509304741,"storm_category_id": 61,"last_accessed_on": "2024-10-23T03:17:11.670098"},{"storm_path_data_id": 37255,"storm_path_id": 4888,"id_index": 4,"lat": 18.6,"lon": 88.2,"date_utc": "2024-10-24T00:00:00","time_utc": "2024-10-24T00:00:00","heading": 334.724374781972,"speed_kts": 6.64,"max_wind_speed": 50.0,"max_gust": 65.0,"central_pressure": 994.0,"output_unit_id": 24,"kts_34_ne": 70.0,"kts_34_se": 70.0,"kts_34_sw": 70.0,"kts_34_nw": 70.0,"kts_50_ne": 20.0,"kts_50_se": 20.0,"kts_50_sw": 20.0,"kts_50_nw": 20.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 25,"created_on": "2024-10-23T23:17:22.522434","updated_by": 20,"updated_on": "2024-10-23T03:17:11.677068","distance_in_miles": 79.67642934994024,"storm_category_id": 61,"last_accessed_on": "2024-10-23T03:17:11.670098"},{"storm_path_data_id": 37259,"storm_path_id": 4888,"id_index": 3,"lat": 17.2,"lon": 89.0,"date_utc": "2024-10-23T12:00:00","time_utc": "2024-10-23T12:00:00","heading": 331.4647802371582,"speed_kts": 7.97,"max_wind_speed": 40.0,"max_gust": 50.0,"central_pressure": 997.0,"output_unit_id": 24,"kts_34_ne": 50.0,"kts_34_se": 50.0,"kts_34_sw": 50.0,"kts_34_nw": 50.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 25,"created_on": "2024-10-23T23:17:22.522434","updated_by": 20,"updated_on": "2024-10-23T03:17:11.677068","distance_in_miles": 95.67942909504961,"storm_category_id": 2,"last_accessed_on": "2024-10-23T03:17:11.670098"},{"storm_path_data_id": 37262,"storm_path_id": 4888,"id_index": 2,"lat": 16.55,"lon": 89.32,"date_utc": "2024-10-23T12:00:00","time_utc": "2024-10-23T02:30:00","heading": 334.7745894058113,"speed_kts": 4.54,"max_wind_speed": 30.0,"max_gust": 40.0,"central_pressure": 1000.0,"output_unit_id": 24,"kts_34_ne": 50.0,"kts_34_se": 50.0,"kts_34_sw": 50.0,"kts_34_nw": 50.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 25,"created_on": "2024-10-23T03:17:11.677068","updated_by": 20,"updated_on": "2024-10-23T10:07:44.441372","distance_in_miles": 43.140230122221695,"storm_category_id": 2,"last_accessed_on": "2024-10-23T03:17:11.670098"},{"storm_path_data_id": 37261,"storm_path_id": 4888,"id_index": 1,"lat": 16.7,"lon": 89.9,"date_utc": "2024-10-23T00:00:00","time_utc": "2024-10-23T00:00:00","heading": 254.89558788697695,"speed_kts": 13.82,"max_wind_speed": 30.0,"max_gust": 40.0,"central_pressure": 1000.0,"output_unit_id": 24,"kts_34_ne": 50.0,"kts_34_se": 50.0,"kts_34_sw": 50.0,"kts_34_nw": 50.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 25,"created_on": "2024-10-23T23:17:22.522434","updated_by": 20,"updated_on": "2024-10-23T03:17:11.677068","distance_in_miles": 34.561778138768645,"storm_category_id": 2,"last_accessed_on": "2024-10-23T03:17:11.670098"}]],"map_hovers": {"storm_398": {"lat": 16.9,"lon": 107.5},"storm_397": {"lat": 21.65,"lon": 84.8}}}
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


