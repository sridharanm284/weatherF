import React, { useState, useEffect } from 'react';
import "./style.scss";
import { Link } from "react-router-dom";
import squall from './../../assets/squall.png';
import Grid from '@mui/material/Unstable_Grid2';
import typhoon from './../../assets/typhoon.png';
import forecast from './../../assets/forecast.png';
import lightning from './../../assets/lightning.png';
import quickOverview from './../../assets/quick-overview.png';
import weatherWindow from './../../assets/weather-window.png';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface CardData {
  name: string;
  url: string;
  image: string;
  content: string;
  color?: string;
}

const CardPlan = () => {
  const [rendered, setRendered] = useState(false)
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CardData[]>([]);

  function returnLastTime(time: string) {
    const dataTime: any = new Date(time)
    const now: any = new Date()
    const seconds = Math.round((now - dataTime) / 1000)
    if (seconds > (86400)) {
      return `${Math.round(seconds / (3600*24))} day`
    } else if (seconds > 3600) {
      return `${Math.round(seconds / 3600)} hr`
    } else {
      return `${Math.round(seconds / 60)} min`
    }
  }

  useEffect(() => {
    if (rendered) return;
    fetch(`http://localhost:8000/api/lastedited/${localStorage.getItem('fid')}`)
      .then(data => data.json())
      .then(lastEditedData => {  
        const cardData: CardData[] = [
          {
            name: 'Forecast',
            url: 'forecast',
            image: forecast,
            content: ((lastEditedData.forecast !== undefined) && (lastEditedData.forecast !== 0)) ? `Last edited ${returnLastTime(lastEditedData.forecast)} ago` : "",
          },
          {
            name: 'Quick Overview',
            url: 'overview',
            image: quickOverview,
            content: ((lastEditedData.quick_overview !== undefined) && (lastEditedData.quick_overview !== 0)) ? `Last edited ${returnLastTime(lastEditedData.quick_overview)} ago` : "",
          },
          {
            name: 'Weather Window',
            url: 'weather',
            image: weatherWindow,
            content: ((lastEditedData.quick_overview !== undefined) && (lastEditedData.quick_overview !== 0)) ? `Last edited ${returnLastTime(lastEditedData.quick_overview)} ago` : "",
          },
          {
            name: 'Squall',
            url: 'forecast',
            image: squall,
            content: '',
            color: 'red',
          },
          {
            name: 'Typhoon',
            url: 'forecast',
            image: typhoon,
            content: ((lastEditedData.typhoon !== undefined) && (lastEditedData.typhoon !== 0)) ? `Last edited ${returnLastTime(lastEditedData.typhoon)} ago` : "",
            color: 'green',
          },
          {
            name: 'Lightning',
            url: 'forecast',
            image: lightning,
            content: '',
            color: 'red',
          },
        ];
        setData(cardData);
      })
      setRendered(true)
  });

  
  return (
    <>
      {data.map((item: CardData) => (
        <Grid key={item.name} xs={12} sm={6} md={6} lg={4}>
          <Link to={`/${item.url}`} state={{ title: item.name }}>
            <div className="hoverable">
              <CardMedia
                className="card-img"
                sx={{ height: 100 }}
                image={item.image}
                title={item.name}
                style={{ borderRadius: '10px' }}
              />
              <Card className="parent_card" style={{ borderRadius: '10px' }}>
                <CardContent
                  className="child_card"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.content}
                    </Typography>
                  </div>
                  {item.color && (
                    <span className={`color_icon color_icon_${item.color}`}></span>
                  )}
                </CardContent>
              </Card>
            </div>
          </Link>
        </Grid>
      ))}
    </>
  );
}

export default CardPlan;
