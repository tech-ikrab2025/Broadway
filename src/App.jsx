// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from "./Home.jsx"
// import PrivacyPolicy from './PrivacyPolicy.jsx'
// function App() {
//   return (
//     <div>
//      <Home/>
//      {/* This shows Privacy Policy only when the URL is /privacypolicy */}
//         <Route path="/privacypolicy" element={<PrivacyPolicy />} />
//     </div>
//   )
// }

// export default App

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Home.jsx";
import PrivacyPolicy from './PrivacyPolicy.jsx';
import ThankYou from './ThankYou.jsx';
import TermsOfUse from './TermsOfUse.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* This shows Home by default at the root URL (/) */}
        <Route path="/" element={<Home />} />
        
        {/* This shows Privacy Policy only when the URL is /privacypolicy */}
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/termsofuse" element={<TermsOfUse />} />
        
      </Routes>
    </Router>
  );
}

export default App;
