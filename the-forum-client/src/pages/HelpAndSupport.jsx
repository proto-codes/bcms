import React from 'react';

const HelpAndSupport = () => {
  return (
    <div className="my-3 p-3">
      <h3 className="text-center mb-4">Help & Support</h3>

      {/* FAQs Section */}
      <section className="mb-5">
        <h4 className="mb-4">Frequently Asked Questions (FAQs)</h4>

        <div className="accordion" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                How do I register on the site?
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                You can register by clicking the 'Sign Up' button on the homepage and providing your information.
              </div>
            </div>
          </div>
          
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                How do I reset my password?
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                Click 'Forgot Password' on the login page, and we will send you an email with instructions to reset your password.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                Where can I find a user guide for the platform?
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                You can download the comprehensive User Guide from the section below or contact our support team for more information.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Guide Section */}
      <section className="user-guide mb-5">
        <h4 className="mb-4">User Guide</h4>
        <p>
          For detailed instructions on using the platform, you can download our comprehensive User Guide. This guide covers everything from registration to advanced features.
        </p>
        <a href="/path-to-user-guide.pdf" className="btn btn-blue" target="_blank" rel="noopener noreferrer">Download User Guide</a>
      </section>
    </div>
  );
};

export default HelpAndSupport;
