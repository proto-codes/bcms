import React, { useState } from 'react';
import axios from 'axios';

function Contact() {
  const [isSending, setIsSending] = useState(false); // State for button loading
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setIsSending(true); // Set loading state

    const formData = new FormData(e.target); // Create a FormData object

    try {
      // Send form data to Formspree using Axios
      const response = await axios.post('https://formspree.io/f/xgvwgpav', formData, {
        headers: {
          Accept: 'application/json',
        },
      });

      // Handle the response from Formspree
      if (response.status === 200) {
        setSuccessMessage('Message sent successfully!'); // Set success message
        setErrorMessage(''); // Clear error message
        e.target.reset(); // Reset the form after submission
      }
    } catch (error) {
      setErrorMessage('There was an error sending your message. Please try again later.'); // Set error message
      setSuccessMessage(''); // Clear success message
      console.error('Error:', error.response ? error.response.data : error.message);
    } finally {
      setIsSending(false); // Reset loading state
    }
  };

  return (
    <>
      <section className="container p-3">
        <h2 className='text-center text-gold-dark fw-bold mb-5'>Contact Us</h2>
        <div className="row">
          <div className="col-md-6 mb-4">
            <h4>Get in Touch</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" name="name" placeholder="Your Name" required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" placeholder="Your Email" required />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea className="form-control" id="message" name="message" rows="4" placeholder="Your Message" required></textarea>
              </div>
              <button type="submit" className="btn btn-gold-dark" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            {/* Display success or error message */}
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          </div>
          <div className="col-md-6">
            <h4>Contact Information</h4>
            <p><strong>Email:</strong> info@forumclub.com</p>
            <p><strong>Phone:</strong> +123 456 7890</p>
            <p><strong>Address:</strong> 3 Bende Rd By finbarrs Rd, Umuahia, 440236, Abia</p>
            <h4>Find Us Here</h4>
            <iframe
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.2399016447243!2d7.495346374040366!3d5.531387833898666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1042dcc15e2c6853%3A0x1628d3277a92c2af!2sBEMSSOFT!5e0!3m2!1sen!2sng!4v1727709595676!5m2!1sen!2sng"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
