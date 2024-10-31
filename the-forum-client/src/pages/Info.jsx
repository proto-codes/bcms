import React from 'react';
import SamHart from '../assets/img/sam-hart.jpeg'
import PastraArinzeEtie from '../assets/img/pastra-arinze.jpeg'
import AustinAkuma from '../assets/img/austin-akuma.jpeg'
import Gallery1 from '../assets/img/gallery1.jpeg'
import Gallery2 from '../assets/img/gallery2.jpeg'
import Gallery3 from '../assets/img/gallery3.jpeg'
import Gallery4 from '../assets/img/gallery4.jpeg'
import { Link } from 'react-router-dom';

function Info() {
  const executives = [
    {
      name: 'Barr Sam Hart: Mni',
      title: 'President',
      image: SamHart
    },
    {
      name: 'Dr Pastra Arinze Etie',
      title: 'Sec - Gen',
      image: PastraArinzeEtie
    },
    {
      name: 'Mazi Austin Akuma',
      title: 'Treasurer',
      image: AustinAkuma
    }
  ];

  const galleryImages = [
    { src: Gallery1, alt: 'AGM Image 1' },
    { src: Gallery2, alt: 'AGM Image 2' },
    { src: Gallery3, alt: 'AGM Image 3' },
    { src: Gallery4, alt: 'AGM Image 4' } 
  ];

  return (
    <div>
      {/* Hero Section */}
      <header className="background-img bg-gold d-flex align-items-center justify-content-center text-white text-center p-5">
        <div className="position-relative z-2">
          <h1>Welcome to The Forum</h1>
          <p className="lead mb-1">(AKA The League of Gentlemen)</p>
          <p className="lead">Support. Wellness. Philanthropy.</p>
        </div>
      </header>

      <div className="container-fluid">
        {/* About Us Section */}
        <section className="container my-5">
          <div className="text-center mb-4">
            <h3 className="text-gold title-underline">About Us</h3>
          </div>
          <p className="lead text-center mb-4">
            We are the members of “The Forum for Support, Wellness and Philanthropy” (also known as “The League of Gentlemen”), a not-for-profit organization with a registered office at Umuahia, Abia State Nigeria, and registered as a Not-for-Profit organization under Part F of the Companies and Allied Matters Act, (C.A.M.A) 2020, Laws of the Federation of Nigeria.
          </p>
          
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <p className="fs-5">
                <strong>Name:</strong> The name of the Association is “The Forum for Support, Wellness, and Philanthropy”, hereinafter referred to as "The Forum" or “League of Gentlemen”.
              </p>
              <p className="fs-5">
                <strong>Address:</strong> The registered address/secretariat of the Association is in Umuahia, Abia State, Nigeria.
              </p>

              <h4 className="mt-4">Purpose:</h4>
              <ul className="fs-5">
                <li>The Association operates purely as an Association whose core objectives shall be charitable ventures to be initiated and actualized for the benefit of its members and society.</li>
                <li>Being mindful of the diverse interests, beliefs, orientation, and doctrines of its membership, the Association shall not hold any political or religious affiliations or bias to any group or person(s) within or outside the Association.</li>
                <li>The Association aims to serve its members and their interests that fall within its objectives, enhance the members’ well-being, and strive to make positive impacts in the community through the following major objectives:</li>
              </ul>

              <ol className="fs-5">
                <li>Providing support and rallying around bereaved or sick members during their time of need.</li>
                <li>Encouraging exercise, healthy living, and overall wellness among forum or Association members.</li>
                <li>Engaging in corporate social responsibility initiatives to benefit the wider community.</li>
                <li>Any other activities agreed by at least two-thirds majority of the membership as being beneficial to “The Forum”.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Executives Section */}
        <section className="container my-5">
          <div className="text-center mb-4">
            <h3 className="text-gold title-underline">Meet the Executives</h3>
          </div>
          <div className="row justify-content-center">
            {executives.map((exec, index) => (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                <div className="card shadow-sm border-0 text-center">
                  <img 
                    src={exec.image} 
                    alt={exec.name} 
                    className="card-img-top rounded-circle mx-auto mt-3" 
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{exec.name}</h5>
                    <i className="card-text text-muted">{exec.title}</i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AGM Image Gallery Section */}
        <section className="container my-5">
          <div className="text-center mb-4">
            <h3 className="text-gold title-underline">The Forum's AGM</h3>
          </div>
          <p className="text-center text-muted mb-4">January 5th, 2024</p>
          <div className="row g-3">
            {galleryImages.map((img, index) => (
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
        </section>

        <div className="text-center mb-5">
          <Link to="/info/gallery" className="btn btn-gold">View Gallery</Link>
        </div>
      </div>
    </div>
  );
}

export default Info;
