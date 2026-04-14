import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Using Link for SPA navigation

const ThankYou = () => {
    useEffect(() => {
        // Initialize GTM if not already present
        if (!window.dataLayer) {
            (function (w, d, s, l, i) {
                w[l] = w[l] || []; w[l].push({
                    'gtm.start': new Date().getTime(), 
                    event: 'gtm.js'
                }); 
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), 
                    dl = l !== 'dataLayer' ? '&l=' + l : ''; 
                j.async = true; 
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; 
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-T6KGN3B');
        }
    }, []);

    return (
        <>
            {/* GTM Noscript - React version */}
            <noscript>
                <iframe 
                    src="https://www.googletagmanager.com/ns.html?id=GTM-T6KGN3B"
                    height="0" 
                    width="0" 
                    style={{ display: 'none', visibility: 'hidden' }}
                    title="gtm-noscript"
                ></iframe>
            </noscript>

            <section className="thank_area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="top_form_panel">
                                <div className="thank-you-bg text-center">
                                    {/* Using standard FontAwesome classes */}
                                    <i className="far fa-check-circle wow flipInX animated"></i>
                                    
                                    <h3 className="text-center">
                                        Thanks for contacting us.
                                        <span className="d-block"> 
                                            Our Consultant will be in touch with you very shortly.
                                        </span>
                                    </h3>
                                    
                                    <div className="btn_box"> 
                                        {/* Replace with Link for better performance */}
                                        <Link to="/">OK</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ThankYou;