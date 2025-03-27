import React, { useState } from 'react';
import { mediaItems } from '../data/mediaItems';
import Lightbox from 'yet-another-react-lightbox';
import ReactPlayer from 'react-player';
import "yet-another-react-lightbox/styles.css";

const MediaSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredMedia = activeFilter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === activeFilter.slice(0, -1)); // removes 's' from 'photos'/'videos'

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (item.type === 'photo') {
      setLightboxOpen(true);
    } else {
      setVideoModalOpen(true);
    }
  };

  const renderMediaItem = (item) => {
    if (item.type === 'photo') {
      return (
        <div className="media-item" key={item.id} onClick={() => handleItemClick(item)}>
          <div className="media-image">
            <img src={item.src} alt={item.title} />
          </div>
          <div className="media-overlay">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="media-item" key={item.id} onClick={() => handleItemClick(item)}>
          <div className="media-image">
            <img src={item.thumbnail} alt={item.title} />
            <div className="play-button">
              <i className="fas fa-play"></i>
            </div>
          </div>
          <div className="media-overlay">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <section id="media" className="project">
        <div className="container">
          <div className="project-bx">
            <h2>Media</h2>
            <div className="media-filter">
              <button
                className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterClick('all')}
              >
                All
              </button>
              <button
                className={`filter-button ${activeFilter === 'photos' ? 'active' : ''}`}
                onClick={() => handleFilterClick('photos')}
              >
                Photos
              </button>
              <button
                className={`filter-button ${activeFilter === 'videos' ? 'active' : ''}`}
                onClick={() => handleFilterClick('videos')}
              >
                Videos
              </button>
            </div>
            
            <div className="media-grid">
              {filteredMedia.map(item => renderMediaItem(item))}
            </div>
          </div>
        </div>
      </section>

      {/* Photo Lightbox */}
      {lightboxOpen && selectedItem && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: selectedItem.src }]}
        />
      )}

      {/* Video Modal */}
      {videoModalOpen && selectedItem && (
        <div className="video-modal">
          <div className="video-modal-content">
            <button className="close-button" onClick={() => setVideoModalOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
            <ReactPlayer
              url={selectedItem.src}
              width="100%"
              height="100%"
              controls
              playing
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MediaSection; 