import React, { useState } from 'react';
import GalleryImage1 from '../assets/img/gallery1.jpeg';
import GalleryImage2 from '../assets/img/gallery2.jpeg';
import GalleryImage3 from '../assets/img/gallery3.jpeg';
import GalleryImage4 from '../assets/img/gallery4.jpeg';
import GalleryImage5 from '../assets/img/gallery5.jpg';
import GalleryImage6 from '../assets/img/gallery6.jpg';
import GalleryImage7 from '../assets/img/gallery7.jpg';
import GalleryImage8 from '../assets/img/gallery8.jpg';
import GalleryImage9 from '../assets/img/gallery9.jpg';
import GalleryImage10 from '../assets/img/gallery10.jpeg';
import GalleryImage11 from '../assets/img/gallery11.jpeg';
import GalleryImage12 from '../assets/img/gallery12.jpeg';
import GalleryImage13 from '../assets/img/gallery13.jpeg';
import Gallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const imagesAGM = [
  { original: GalleryImage1, thumbnail: GalleryImage1, description: 'Gallery Image 1' },
  { original: GalleryImage2, thumbnail: GalleryImage2, description: 'Gallery Image 2' },
  { original: GalleryImage3, thumbnail: GalleryImage3, description: 'Gallery Image 3' },
  { original: GalleryImage4, thumbnail: GalleryImage4, description: 'Gallery Image 4' },
];

const imagesEvent = [
  { original: GalleryImage5, thumbnail: GalleryImage5, description: 'Gallery Image 5' },
  { original: GalleryImage6, thumbnail: GalleryImage6, description: 'Gallery Image 6' },
  { original: GalleryImage7, thumbnail: GalleryImage7, description: 'Gallery Image 7' },
  { original: GalleryImage8, thumbnail: GalleryImage8, description: 'Gallery Image 8' },
  { original: GalleryImage9, thumbnail: GalleryImage9, description: 'Gallery Image 9' },
];

const imagesConstitution = [
  { original: GalleryImage10, thumbnail: GalleryImage10, description: 'Gallery Image 10' },
  { original: GalleryImage11, thumbnail: GalleryImage11, description: 'Gallery Image 11' },
  { original: GalleryImage12, thumbnail: GalleryImage12, description: 'Gallery Image 12' },
  { original: GalleryImage13, thumbnail: GalleryImage13, description: 'Gallery Image 13' },
];

const GalleryView = () => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const openGallery = (index) => setCurrentIndex(index);
  const closeGallery = () => setCurrentIndex(null);

  return (
    <div className="container my-4">
      <div className="text-center mb-4">
        <h3 className="text-gold title-underline mb-4">Gallery</h3><br />
        <h3 className="text-gold title-underline mb-4">The Forum's AGM - January 5th, 2024</h3>
      </div>
      <div className="row g-3 mb-5">
        {imagesAGM.map((img, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
            <div className="card shadow-sm" onClick={() => openGallery(index)}>
              <img 
                src={img.thumbnail} 
                alt={img.description} 
                className="card-img-top" 
                style={{ objectFit: 'cover', height: '200px', cursor: 'pointer' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mb-4">
        <h3 className="text-gold title-underline mb-4">Event</h3><br />
        <h3 className="text-gold title-underline m-0">The Forum’s monthly health walk for October hosted by Obioma Akomas</h3>
      </div>
      <div className="row g-3 mb-5">
        {imagesEvent.map((img, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
            <div className="card shadow-sm" onClick={() => openGallery(imagesAGM.length + index)}>
              <img 
                src={img.thumbnail} 
                alt={img.description} 
                className="card-img-top" 
                style={{ objectFit: 'cover', height: '200px', cursor: 'pointer' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mb-4">
        <h3 className="text-gold title-underline mb-4">Constitution Review meeting @ Roots Umuahia</h3>
      </div>
      <div className="row g-3">
        {imagesConstitution.map((img, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
            <div className="card shadow-sm" onClick={() => openGallery(imagesAGM.length + imagesEvent.length + index)}>
              <img 
                src={img.thumbnail} 
                alt={img.description} 
                className="card-img-top" 
                style={{ objectFit: 'cover', height: '200px', cursor: 'pointer' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bootstrap Modal for Gallery */}
      <div className={`modal fade ${currentIndex !== null ? 'show' : ''}`} style={{ display: currentIndex !== null ? 'block' : 'none', overflow: 'hidden' }} tabIndex="-1" role="dialog" aria-labelledby="galleryModalLabel" aria-hidden={currentIndex === null}>
        <div className="modal-dialog modal-fullscreen" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="galleryModalLabel">Gallery</h5>
              <button type="button" className="btn-close" onClick={closeGallery} aria-label="Close"></button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              {currentIndex !== null && (
                <Gallery
                  items={[...imagesAGM, ...imagesEvent, ...imagesConstitution]}
                  startIndex={currentIndex}
                  onClose={closeGallery}
                  showThumbnails={false} // Hide thumbnails for fullscreen experience
                  showFullscreenButton={true}
                  showBullets={true}
                  style={{ height: '100vh' }} // Ensure the gallery takes full height
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryView;
