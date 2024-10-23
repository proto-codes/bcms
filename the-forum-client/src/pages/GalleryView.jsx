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
import GalleryImage14 from '../assets/video/gallery14.mp4';
import GalleryImage15 from '../assets/img/gallery15.jpg';
import GalleryImage16 from '../assets/img/gallery16.jpg'; 
import GalleryImage17 from '../assets/img/gallery17.jpg';
import GalleryImage18 from '../assets/img/gallery18.jpg';
import GalleryImage19 from '../assets/img/gallery19.jpg';
import GalleryImage20 from '../assets/img/gallery20.jpg';
import GalleryImage21 from '../assets/img/gallery21.jpg';
import GalleryImage22 from '../assets/img/gallery22.jpg';
import GalleryImage23 from '../assets/img/gallery23.jpg';
import GalleryImage24 from '../assets/img/gallery24.jpg';
import GalleryImage25 from '../assets/img/gallery25.jpg';
import GalleryImage26 from '../assets/img/gallery26.jpg';
import GalleryImage27 from '../assets/img/gallery27.jpg';
import GalleryImage28 from '../assets/img/gallery28.jpg';
import GalleryImage29 from '../assets/img/gallery29.jpg';
import GalleryImage30 from '../assets/img/gallery30.jpg';
import GalleryImage31 from '../assets/img/gallery31.jpg';
import GalleryImage32 from '../assets/img/gallery32.jpg';
import GalleryImage33 from '../assets/img/gallery33.jpg';
import GalleryImage34 from '../assets/img/gallery34.jpg';
import GalleryImage35 from '../assets/img/gallery35.jpg';
import GalleryImage36 from '../assets/img/gallery36.jpg';
import GalleryImage37 from '../assets/img/gallery37.jpg';
import GalleryImage38 from '../assets/img/gallery38.jpg';
import GalleryImage39 from '../assets/img/gallery39.jpg';
import GalleryImage40 from '../assets/img/gallery40.jpg';
import GalleryImage41 from '../assets/img/gallery41.jpg';
import GalleryImage42 from '../assets/video/gallery42.mp4';
import GalleryImage43 from '../assets/video/gallery43.mp4';
import GalleryImage44 from '../assets/video/gallery44.mp4';
import GalleryImage45 from '../assets/img/gallery45.jpg';
import GalleryImage46 from '../assets/img/gallery46.jpg';
import GalleryImage47 from '../assets/img/gallery47.jpg';
import GalleryImage48 from '../assets/img/gallery48.jpg';
import GalleryImage49 from '../assets/img/gallery49.jpg';
import GalleryImage50 from '../assets/img/gallery50.jpg';
import GalleryImage51 from '../assets/img/gallery51.jpg';
import GalleryImage52 from '../assets/img/gallery52.jpg';
import GalleryImage53 from '../assets/img/gallery53.jpg';
import GalleryImage54 from '../assets/img/gallery54.jpg';
import GalleryImage55 from '../assets/img/gallery55.jpg';
import GalleryImage56 from '../assets/img/gallery56.jpg';
import GalleryImage57 from '../assets/video/gallery57.mp4';
import GalleryImage58 from '../assets/img/gallery58.jpg';
import GalleryImage59 from '../assets/img/gallery59.jpg';
import GalleryImage60 from '../assets/img/gallery60.jpg';
import GalleryImage61 from '../assets/img/gallery61.jpg';
import GalleryImage62 from '../assets/img/gallery62.jpg';
import GalleryImage63 from '../assets/img/gallery63.jpg';
import GalleryImage64 from '../assets/img/gallery64.jpg';
import GalleryImage65 from '../assets/img/gallery65.jpg';
import GalleryImage66 from '../assets/img/gallery66.jpg';
import GalleryImage67 from '../assets/img/gallery67.jpg';
import GalleryImage68 from '../assets/img/gallery68.jpg';
import GalleryImage69 from '../assets/img/gallery69.jpg';
import GalleryImage70 from '../assets/img/gallery70.jpg';
import GalleryImage71 from '../assets/img/gallery71.jpg';
import GalleryImage72 from '../assets/img/gallery72.jpg';
import GalleryImage73 from '../assets/img/gallery73.jpg';
import GalleryImage74 from '../assets/img/gallery74.jpg';
import GalleryImage75 from '../assets/img/gallery75.jpg';
import GalleryImage76 from '../assets/img/gallery76.jpg';
import GalleryImage77 from '../assets/img/gallery77.jpg';
import GalleryImage78 from '../assets/img/gallery78.jpg';
import GalleryImage79 from '../assets/img/gallery79.jpg';
import GalleryImage80 from '../assets/img/gallery80.jpg';
import GalleryImage81 from '../assets/img/gallery81.jpg';
import GalleryImage82 from '../assets/img/gallery82.jpg';
import GalleryImage83 from '../assets/img/gallery83.jpg';
import GalleryImage84 from '../assets/img/gallery84.jpg';
import GalleryImage85 from '../assets/img/gallery85.jpg';
import GalleryImage86 from '../assets/img/gallery86.jpg';
import GalleryImage87 from '../assets/img/gallery87.jpg';
import GalleryImage88 from '../assets/img/gallery88.jpg';
import GalleryImage89 from '../assets/img/gallery89.jpg';

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

const imagesVideoGallery = [
  { original: GalleryImage14, thumbnail: GalleryImage14, description: 'Gallery Video 14', isVideo: true },
  { original: GalleryImage15, thumbnail: GalleryImage15, description: 'Gallery Image 15' },
  { original: GalleryImage16, thumbnail: GalleryImage16, description: 'Gallery Image 16' },
  { original: GalleryImage17, thumbnail: GalleryImage17, description: 'Gallery Image 17' },
  { original: GalleryImage18, thumbnail: GalleryImage18, description: 'Gallery Image 18' },
  { original: GalleryImage19, thumbnail: GalleryImage19, description: 'Gallery Image 19' },
  { original: GalleryImage20, thumbnail: GalleryImage20, description: 'Gallery Image 20' },
  { original: GalleryImage21, thumbnail: GalleryImage21, description: 'Gallery Image 21' },
  { original: GalleryImage22, thumbnail: GalleryImage22, description: 'Gallery Image 22' },
  { original: GalleryImage23, thumbnail: GalleryImage23, description: 'Gallery Image 23' },
  { original: GalleryImage24, thumbnail: GalleryImage24, description: 'Gallery Image 24' },
  { original: GalleryImage25, thumbnail: GalleryImage25, description: 'Gallery Image 25' },
  { original: GalleryImage26, thumbnail: GalleryImage26, description: 'Gallery Image 26' },
  { original: GalleryImage27, thumbnail: GalleryImage27, description: 'Gallery Image 27' },
  { original: GalleryImage28, thumbnail: GalleryImage28, description: 'Gallery Image 28' },
  { original: GalleryImage29, thumbnail: GalleryImage29, description: 'Gallery Image 29' },
  { original: GalleryImage30, thumbnail: GalleryImage30, description: 'Gallery Image 30' },
  { original: GalleryImage31, thumbnail: GalleryImage31, description: 'Gallery Image 31' },
  { original: GalleryImage32, thumbnail: GalleryImage32, description: 'Gallery Image 32' },
  { original: GalleryImage33, thumbnail: GalleryImage33, description: 'Gallery Image 33' },
  { original: GalleryImage34, thumbnail: GalleryImage34, description: 'Gallery Image 34' },
  { original: GalleryImage35, thumbnail: GalleryImage35, description: 'Gallery Image 35' },
  { original: GalleryImage36, thumbnail: GalleryImage36, description: 'Gallery Image 36' },
  { original: GalleryImage37, thumbnail: GalleryImage37, description: 'Gallery Image 37' },
  { original: GalleryImage38, thumbnail: GalleryImage38, description: 'Gallery Image 38' },
  { original: GalleryImage39, thumbnail: GalleryImage39, description: 'Gallery Image 39' },
  { original: GalleryImage40, thumbnail: GalleryImage40, description: 'Gallery Image 40' },
  { original: GalleryImage41, thumbnail: GalleryImage41, description: 'Gallery Image 41' },
  { original: GalleryImage42, thumbnail: GalleryImage42, description: 'Gallery Video 42', isVideo: true },
  { original: GalleryImage43, thumbnail: GalleryImage43, description: 'Gallery Video 43', isVideo: true },
  { original: GalleryImage44, thumbnail: GalleryImage44, description: 'Gallery Video 44', isVideo: true },
  { original: GalleryImage45, thumbnail: GalleryImage45, description: 'Gallery Image 45' },
  { original: GalleryImage46, thumbnail: GalleryImage46, description: 'Gallery Image 46' },
  { original: GalleryImage47, thumbnail: GalleryImage47, description: 'Gallery Image 47' },
  { original: GalleryImage48, thumbnail: GalleryImage48, description: 'Gallery Image 48' },
  { original: GalleryImage49, thumbnail: GalleryImage49, description: 'Gallery Image 49' },
  { original: GalleryImage50, thumbnail: GalleryImage50, description: 'Gallery Image 50' },
  { original: GalleryImage51, thumbnail: GalleryImage51, description: 'Gallery Image 51' },
  { original: GalleryImage52, thumbnail: GalleryImage52, description: 'Gallery Image 52' },
  { original: GalleryImage53, thumbnail: GalleryImage53, description: 'Gallery Image 53' },
  { original: GalleryImage54, thumbnail: GalleryImage54, description: 'Gallery Image 54' },
  { original: GalleryImage55, thumbnail: GalleryImage55, description: 'Gallery Image 55' },
  { original: GalleryImage56, thumbnail: GalleryImage56, description: 'Gallery Image 56' },
  { original: GalleryImage57, thumbnail: GalleryImage57, description: 'Gallery Video 57', isVideo: true },
  { original: GalleryImage58, thumbnail: GalleryImage58, description: 'Gallery Image 58' },
  { original: GalleryImage59, thumbnail: GalleryImage59, description: 'Gallery Image 59' },
  { original: GalleryImage60, thumbnail: GalleryImage60, description: 'Gallery Image 60' },
  { original: GalleryImage61, thumbnail: GalleryImage61, description: 'Gallery Image 61' },
  { original: GalleryImage62, thumbnail: GalleryImage62, description: 'Gallery Image 62' },
  { original: GalleryImage63, thumbnail: GalleryImage63, description: 'Gallery Image 63' },
  { original: GalleryImage64, thumbnail: GalleryImage64, description: 'Gallery Image 64' },
  { original: GalleryImage65, thumbnail: GalleryImage65, description: 'Gallery Image 65' },
  { original: GalleryImage66, thumbnail: GalleryImage66, description: 'Gallery Image 66' },
  { original: GalleryImage67, thumbnail: GalleryImage67, description: 'Gallery Image 67' },
  { original: GalleryImage68, thumbnail: GalleryImage68, description: 'Gallery Image 68' },
  { original: GalleryImage69, thumbnail: GalleryImage69, description: 'Gallery Image 69' },
  { original: GalleryImage70, thumbnail: GalleryImage70, description: 'Gallery Image 70' },
  { original: GalleryImage71, thumbnail: GalleryImage71, description: 'Gallery Image 71' },
  { original: GalleryImage72, thumbnail: GalleryImage72, description: 'Gallery Image 72' },
  { original: GalleryImage73, thumbnail: GalleryImage73, description: 'Gallery Image 73' },
  { original: GalleryImage74, thumbnail: GalleryImage74, description: 'Gallery Image 74' },
  { original: GalleryImage75, thumbnail: GalleryImage75, description: 'Gallery Image 75' },
  { original: GalleryImage76, thumbnail: GalleryImage76, description: 'Gallery Image 76' },
  { original: GalleryImage77, thumbnail: GalleryImage77, description: 'Gallery Image 77' },
  { original: GalleryImage78, thumbnail: GalleryImage78, description: 'Gallery Image 78' },
  { original: GalleryImage79, thumbnail: GalleryImage79, description: 'Gallery Image 79' },
  { original: GalleryImage80, thumbnail: GalleryImage80, description: 'Gallery Image 80' },
  { original: GalleryImage81, thumbnail: GalleryImage81, description: 'Gallery Image 81' },
  { original: GalleryImage82, thumbnail: GalleryImage82, description: 'Gallery Image 82' },
  { original: GalleryImage83, thumbnail: GalleryImage83, description: 'Gallery Image 83' },
  { original: GalleryImage84, thumbnail: GalleryImage84, description: 'Gallery Image 84' },
  { original: GalleryImage85, thumbnail: GalleryImage85, description: 'Gallery Image 85' },
  { original: GalleryImage86, thumbnail: GalleryImage86, description: 'Gallery Image 86' },
  { original: GalleryImage87, thumbnail: GalleryImage87, description: 'Gallery Image 87' },
  { original: GalleryImage88, thumbnail: GalleryImage88, description: 'Gallery Image 88' },
  { original: GalleryImage89, thumbnail: GalleryImage89, description: 'Gallery Image 89' },
];

const GalleryView = () => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const openGallery = (index) => setCurrentIndex(index);
  const closeGallery = () => setCurrentIndex(null);

  return (
    <div className="container my-4">
      {/* AGM Section */}
      <div className="text-center mb-4">
        <h3 className="text-gold title-underline mb-4">Gallery</h3><br />
        <p className="text-gold fs-5 mb-4">The Forum's AGM - January 5th, 2024</p>
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

      {/* Event Section */}
      <div className="text-center mb-4">
        <h3 className="text-gold title-underline mb-4">Event</h3><br />
        <p className="text-gold fs-5 mb-4">The Forum’s monthly health walk for October hosted by Obioma Akomas</p>
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

      {/* Constitution Review Section */}
      <div className="text-center mb-4">
        <p className="text-gold fs-5 mb-4">Constitution Review meeting @ Roots Umuahia</p>
      </div>
      <div className="row g-3 mb-5">
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

      {/* Explore more media */}
      <div className="text-center mb-4">
        <p className="text-gold fs-5 mb-4">Explore more media</p>
      </div>
      <div className="row g-3 mb-5">
        {imagesVideoGallery.map((img, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
            <div className="card shadow-sm" onClick={() => openGallery(imagesAGM.length + imagesEvent.length + imagesConstitution.length + index)}>
              {img.isVideo ? (
                <video className="card-img-top" controls style={{ height: '200px', objectFit: 'contain' }}>
                  <source src={img.original} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={img.thumbnail} 
                  alt={img.description} 
                  className="card-img-top" 
                  style={{ objectFit: 'cover', height: '200px', cursor: 'pointer' }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Fullscreen Gallery */}
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
                  items={[...imagesAGM, ...imagesEvent, ...imagesConstitution, ...imagesVideoGallery]}
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
};

export default GalleryView;
