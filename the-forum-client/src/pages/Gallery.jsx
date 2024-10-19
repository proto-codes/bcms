import React from 'react';
import GalleryImage1 from '../assets/img/gallery1.jpeg';
import GalleryImage2 from '../assets/img/gallery2.jpeg';
import GalleryImage3 from '../assets/img/gallery3.jpeg';
import GalleryImage4 from '../assets/img/gallery4.jpeg';
// Add more imports as needed

function Gallery() {
  const images = [
    { src: GalleryImage1, alt: 'Gallery Image 1' },
    { src: GalleryImage2, alt: 'Gallery Image 2' },
    { src: GalleryImage3, alt: 'Gallery Image 3' },
    { src: GalleryImage4, alt: 'Gallery Image 4' },
    // Add more images as needed
  ];

  return (
    <div className="container my-4">
      <div className="text-center mb-4">
        <h3 className="text-gold title-underline">Gallery</h3>
      </div>
      <div className="row g-3">
        {images.map((img, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
            <div className="card shadow-sm">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="card-img-top" 
                style={{ objectFit: 'cover', height: '200px' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
