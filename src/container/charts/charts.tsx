import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, CircularProgress, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import './charts.scss';

const Charts: React.FC = () => {
  const [files, setFiles] = useState<{ gifFiles: { title: string; data: string }[] }>({ gifFiles: [] });
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const itemsPerPage = 1;

  useEffect(() => {
    const fetchDropdownNames = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/converter/api/dropdown-list');
        const data = await response.json();
        setRegions(data.drop_down_list_names || []);
      } catch (error) {
        console.error('Error fetching dropdown names:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownNames();
  }, []);

  const handleCloseVideo = () => {
    setVideoUrl(null); 
  };
  

  useEffect(() => {
    if (!selectedType || !selectedRegion) return;

    const fetchFiles = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/converter/api/images/?chart_type=${selectedType.toLowerCase()}&region=${encodeURIComponent(selectedRegion)}`
        );
        const data = await response.json();
        setFiles({ gifFiles: data.images || [] });
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [selectedType, selectedRegion]);

  const handleAnimate = () => {
    if (files.gifFiles.length === 0) {
      alert('No video available for the selected type and region.');
      return;
    }
    const videoUrl = `http://localhost:8000/converter/api/video/?chart_type=${selectedType.toLowerCase()}&region=${(selectedRegion)}`;
    setVideoUrl(videoUrl);
  };

  const handleNext = () => {
    if ((currentPage + 1) * itemsPerPage < files.gifFiles.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const paginatedImages = files.gifFiles.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="chart">
      {loading ? (
        <div className="loader">
          {/* <CircularProgress /> */}
        </div>
      ) : (
        <>
          <div className="header">
            <h1>Wind - Waves - Current Charts</h1>
          </div>
          <div className="controls">
            <FormControl className="dropdown">
              <InputLabel>Select Chart Type</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {['Wind', 'Waves', 'Current'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="dropdown">
              <InputLabel>Select Region</InputLabel>
              <Select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setCurrentPage(0);
                  setVideoUrl(null); 
                }}
              >
                {regions.map((region, index) => (
                  <MenuItem key={index} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="image-card">
  {videoUrl ? (
    <div className="video-container">
      <button className="close-icon" onClick={handleCloseVideo}>
        ✖
      </button>
      
      <video controls autoPlay className="chart-video">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  ) : (
    <>
      {paginatedImages.length > 0 ? (
        paginatedImages.map((file, index) => (
          <div key={index} className="image-wrapper">
            <ArrowBackIos
              className="nav-icon left"
              onClick={handlePrev}
              style={{ visibility: currentPage === 0 ? 'hidden' : 'visible' }}
            />
            <img
              src={`data:image/png;base64,${file.data}`}
              alt={file.title}
              className="chart-image"
            />
            <ArrowForwardIos
              className="nav-icon right"
              onClick={handleNext}
              style={{
                visibility:
                  (currentPage + 1) * itemsPerPage >= files.gifFiles.length
                    ? 'hidden'
                    : 'visible',
              }}
            />
            <p>{file.title}</p>
          </div>
        ))
      ) : (
        <p></p>
      )}
    </>
  )}
</div>


          <div className="animate-btn">
            <Button variant="contained" color="primary" onClick={handleAnimate}>
              Animate
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Charts;
