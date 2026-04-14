import React from "react";
import "./assets/css/style.css";
import "./assets/css/bootstrap.css";

export default function Terms() {
  const lastUpdated = new Date();
  lastUpdated.setDate(lastUpdated.getDate() - 1);

  const formattedDate = lastUpdated.toLocaleDateString("en-GB");

  return (
    <>
      {/* Banner Section */}
      <section className="inner_bnr">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb_area">
                <h1>Terms and Conditions</h1>
                <ul>
                  <li>
                    <a href="/">Home</a> / Terms and Conditions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body Section */}
      <section className="inner_body">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-uppercase">Terms of Use</h1>
              <h3>Last Updated: {formattedDate}</h3>

              <div className="priv-text">
                <h4>Introduction</h4>
                <p>
                  Welcome to JMC Broadway! By accessing or using our website
                  located at https://www.jmcbroadway.com/ (the “Site”), you 
                  agree to comply with and be bound by these Terms of Use. If
                  you do not agree with these terms, please do not use our Site.
                </p>

                <h4>1. Acceptance of Terms</h4>
                <p>
                  By using this Site, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Use and
                  our Privacy Policy.
                </p>

                <h4>2. Changes to Terms</h4>
                <p>
                  JMC Broadway reserves the right to modify these Terms of
                  Use at any time. Any changes will be effective immediately
                  upon posting on the Site. Your continued use of the Site after
                  any modifications signifies your acceptance of the updated
                  Terms.
                </p>

                <h4>3. Use of Site</h4>
                <p>
                  You agree to use the Site only for lawful purposes and in
                  accordance with these Terms. You are prohibited from using the
                  Site:
                </p>
                <p>
                  In any way that violates any applicable federal, state, local,
                  or international law or regulation.
                </p>
                <p>
                  For the purpose of exploiting, harming, or attempting to
                  exploit or harm minors in any way.
                </p>
                <p>
                  To transmit, or procure the sending of, any advertising or
                  promotional material, including any “junk mail,” “chain
                  letter,” “spam,” or any other similar solicitation.
                </p>

                <h4>4. Intellectual Property</h4>
                <p>
                  All content, trademarks, and other intellectual property on
                  the Site are owned by or licensed to JMC Broadway. You may
                  not reproduce, distribute, modify, create derivative works of,
                  publicly display, or otherwise use any of the content without
                  our prior written consent.
                </p>

                <h4>5. User Accounts</h4>
                <p>
                  To access certain features of the Site, you may be required to
                  create an account. You agree to provide accurate, current, and
                  complete information during the registration process and to
                  update such information to keep it accurate, current, and
                  complete. You are responsible for maintaining the
                  confidentiality of your account and password.
                </p>

                <h4>6. Disclaimer of Warranties</h4>
                <p>
                  The Site is provided on an “as is” and “as available” basis.
                  JMC Broadway makes no representations or warranties of any
                  kind, express or implied.
                </p>

                <h4>7. Limitation of Liability</h4>
                <p>
                  To the fullest extent permitted by law, JMC Broadway shall
                  not be liable for any direct, indirect, incidental, special,
                  consequential, or punitive damages arising from your use of
                  the Site.
                </p>

                <h4>8. Indemnification</h4>
                <p>
                  You agree to indemnify and hold harmless JMC Broadway and
                  its affiliates from any claims, damages, or expenses arising
                  from your use of the Site.
                </p>

                <h4>9. Governing Law</h4>
                <p>
                  These Terms shall be governed by and construed in accordance
                  with the laws of India.
                </p>

                <h4>10. Contact Information</h4>
                <p>
                  510Earth <br />
                  364, Shantipally, Rajdanga, <br />
                  P.S- Kasba, District- South 24 Parganas, <br />
                  Kolkata-700107 <br />
                  West Bengal <br />
                  Call: +91-9832064905
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}