import React, { useEffect, useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./assets/css/style.css";
import "./assets/css/bootstrap.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import SliderComponent from "react-slick";
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Theme CSS
import { Link, useNavigate } from "react-router-dom";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import "lightgallery/css/lg-thumbnail.css"; // Add this for thumbnails
import "lightgallery/css/lg-zoom.css";
import axios from "axios";

export default function Home() {

  const [readMore, setReadMore] = useState(false);
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);
  // const [activeTab, setActiveTab] = useState("2bhk");
  const [activeTab, setActiveTab] = useState("Basement Floor");
  const [showModal, setShowModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const recaptchaRef = useRef();
  const navigate = useNavigate();

  const [gclid, setGclid] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const response = await axios.post(
        "https://www.510earth.com/MicroWebsiteAPI/SaveNewLeads", // 🔴 replace 
        {
          CustomerName: formData.fullName,
          Email: formData.email,
          ContactNumber: formData.phone,
          IsdCode: "91", // 🇮🇳 India

          Message: formData.message || "",

          PropertyName: "JMC Broadway",      // ✅ hardcoded
          PropertyId: "491",             // ✅ from hidden field
          gclid_field: gclid || "",               // keep empty if not using ads
          form_type: "REQ",         // or "Sidebar Form"

          PropertyTypeId: "1",           // ask if unsure
          rPropertyType: "Residential",  // ✅
          SubPropertyTypeId: "1",        // ask if unsure
          SubPropertyType: "Flat/Apartment",
          recaptchaToken: captchaToken
        }
      );
      //console.log("recaptchaToken:", captchaToken);
      console.log("Success:", response.data);

      navigate("/thankyou");

    } catch (error) {
      console.error("Error:", error);
      alert("Submission failed!");
    }
  };

  const handleDownloadSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateDownloadField();
    if (!isValid) return;

    try {
      const response = await axios.post(
        "https://www.510earth.com/MicroWebsiteAPI/SaveNewLeads", // 🔴 replace
        {
          CustomerName: formDownloadData.fullName,
          Email: formDownloadData.email,
          ContactNumber: formDownloadData.phone,
          IsdCode: "91",
          Message: formDownloadData.message || "",
          PropertyName: "JMC Broadway",
          PropertyId: "491",
          gclid_field: gclid || "",
          form_type: "EBRCREQ",
          PropertyTypeId: "1",
          rPropertyType: "Residential",
          SubPropertyTypeId: "1",
          SubPropertyType: "Flat/Apartment",
          recaptchaToken: "" // optional if not using captcha here
        }
      );

      console.log("Download form submitted:", response.data);

      // ✅ Download after API success
      const link = document.createElement("a");
      link.href = "/eBrochure/JMCBROADWAY.pdf";
      link.download = "JMCBROADWAY.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      navigate("/thankyou");

    } catch (error) {
      console.error("Error:", error);
      alert("Submission failed!");
    }
  };

  const onCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
      setCaptchaToken(value); // ✅ SAVE TOKEN HERE
      // Your logic to hide it after callback
      console.log("Captcha Value:", value);
    }
  };
  const Slider = SliderComponent.default || SliderComponent;
  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  const [formDownloadData, setDownloadFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: ""
  });

  const [downloaderrors, downloadsetErrors] = useState({});

  // 2. Validation Logic
  const validateField = (name, value) => {
    let error = "";

    if (name === "fullName") {
      if (!value) error = "Please Enter Name";
      else if (!/^[A-Za-z\s]+$/.test(value)) error = "Name should only contain letters";
    }

    if (name === "phone") {
      if (!value) error = "Please Enter Phone Number";
      else if (!/^\d+$/.test(value)) error = "Phone should only contain numbers";
      else if (value.length !== 10) error = "The phone number is the wrong length. Please enter 10 digit mobile no.";
    }

    if (name === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Please enter valid email address.";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateDownloadField = () => {
    let newErrors = {};

    // ✅ Name
    if (!formDownloadData.fullName) {
      newErrors.fullName = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formDownloadData.fullName)) {
      newErrors.fullName = "Name should contain only letters";
    }

    // ✅ Phone
    if (!formDownloadData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formDownloadData.phone)) {
      newErrors.phone = "Enter valid 10 digit number";
    }

    // ✅ Email (REQUIRED)
    if (!formDownloadData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formDownloadData.email)) {
      newErrors.email = "Enter valid email";
    }

    downloadsetErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleInputDownloadChange = (e) => {
    const { name, value } = e.target;
    setDownloadFormData(prev => ({ ...prev, [name]: value }));
    //validateDownloadField(name, value);
  };

  // 3. Form Readiness Check (Required for Submit button)
  const isFormValid =
    /^[A-Za-z\s]+$/.test(formData.fullName) &&   // ✅ valid name only
    /^\d{10}$/.test(formData.phone) &&           // ✅ exactly 10 digits
    !errors.fullName &&
    !errors.phone &&
    !errors.email &&
    captchaVerified;

  const isDownloadFormValid =
    /^[A-Za-z\s]+$/.test(formDownloadData.fullName) &&
    /^\d{10}$/.test(formDownloadData.phone) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formDownloadData.email);

  const gallerySettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,             // Keep this true
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          arrows: true,       // Keep arrows visible on tablets
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,      // Better for mobile touch
        }
      }
    ]
  };

  const resetDownloadForm = () => {
    setDownloadFormData({
      fullName: "",
      phone: "",
      email: "",
      message: ""
    });

    downloadsetErrors({});
  };

  // Do the same for sliderSettings if you use it for the 3BHK section
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,             // Changed from false to true
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const locations = [
    { icon: "fa-plane", title: "Airport", text: "Netaji Subhash Chandra Bose International Airport : 12 km" },
    // { icon: "fa-piggy-bank", title: "Bank", text: "Bandhan Bank : 0.27km" },
    { icon: "fa-bus", title: "Bus Stop", text: "Karunamoyee : 2.1 km" },
    { icon: "fa-graduation-cap", title: "College", text: "St. Xavier’s College : 6.6 km" },
    { icon: "fa-hospital", title: "Hospital", text: "Tata Medical Center : 5.1 km" },
    // { icon: "fa-child", title: "Kindergarten", text: "Sandipan Kindergarten : 0.35km" },
    // { icon: "fa-map-location-dot", title: "Land Mark", text: "Bonhooghly : 0.70km" },
    { icon: "fa-cart-shopping", title: "Mall", text: "Axis Mall : 2.2 km" },
    // { icon: "fa-shop", title: "Market", text: "Bonorini Market : 0.65km" },
    { icon: "fa-train-subway", title: "Metro", text: "Sector V Metro Station : 700 m" },
    // { icon: "fa-location-dot", title: "Near By Circle", text: "Biswa Bangla Gate : 21km" },
    // { icon: "fa-bacon", title: "Public Park", text: "Lake View Children Park : 0.40km" },
    { icon: "fa-train", title: "Railway Station", text: "Bidhannagar Railway Station : 6 km" },
    { icon: "fa-chalkboard-user", title: "School", text: "Globsyn Business School : 2.3 km" },
    { icon: "fa-laptop", title: "Tech Park", text: "Wipro Campus : 300 m" },
    // { icon: "fa-gopuram", title: "Temple", text: "Baba Lokenath Temple : 0.30km" },
    { icon: "fa-building-columns", title: "University", text: "Techno India University : 1.5km" }
  ];

  // Auto open sidebar every 30 sec
  useEffect(() => {
    const toggle = document.querySelector(".toggle");
    const sidebar = document.querySelector(".sidebar-contact");

    toggle?.addEventListener("click", () => {
      sidebar?.classList.toggle("active");
    });
  }, []);

  useEffect(() => {
    // Auto open sidebar every 30 sec
    const interval = setInterval(() => {
      const sidebar = document.querySelector(".sidebar-contact");
      const toggle = document.querySelector(".toggle");

      sidebar?.classList.add("active");
      toggle?.classList.add("active");
    }, 30000);

    return () => clearInterval(interval); // cleanup
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gclidParam = params.get("gclid");

    if (gclidParam) {
      console.log("gclid:", gclidParam);
      setGclid(gclidParam);

      // Optional: store in localStorage (recommended)
      localStorage.setItem("gclid", gclidParam);
    } else {
      // fallback if user navigates internally
      const storedGclid = localStorage.getItem("gclid");
      if (storedGclid) {
        setGclid(storedGclid);
      }
    }
  }, []);

  const getImagePath = (tabName) => {
    switch (tabName) {
      case "Basement Floor": return "/images/basement.webp";
      case "Ground Floor": return "/images/bhk_img1.webp";
      case "3rd Floor": return "/images/bhk_img2.webp";
      case "4-9th Floor": return "/images/bhk_img5.webp";
      case "10th Floor": return "/images/bhk_img4.webp";
      case "11th Floor": return "/images/bhk_img3.webp";
      default: return "/images/basement.webp";
    }
  };

  return (
    <>
      {/* TOP HEADER */}
      {/* <div className="top_head">
        <div className="container">
          <a href="tel:+919832064905">
            <i className="fa-solid fa-square-phone"></i> +91-9832064905
          </a>
        </div>
      </div> */}
      <div className={`sidebar-contact ${isSidebarActive ? "active" : ""}`}>
        <div className="toggle" onClick={toggleSidebar}>
          <span id="Enq_btn">ENQUIRE NOW</span>
        </div>
        <div className="scroll">
          <div className="row">
            <div className="col-lg-4 col-sm-12">
              <div className="modal_logo">
                <img src="/images/logo.webp" alt="JMC Broadway E-Brochure" />
              </div>
            </div>
            <div className="col-lg-8 col-sm-12">
              <h6 className="modal-head">
                Are you interested about <span>JMC Broadway?</span>
              </h6>
            </div>
          </div>
          <div className="row sidebar_modal_img">
            <div className="col-4 text-center">
              <img src="/images/call_back.jpg" alt="Instant Call Back" />
              <p>Instant Call Back</p>
            </div>

            <div className="col-4 text-center">
              <img src="/images/free-site-vist.jpg" alt="Free Site Visit" />
              <p>Free Site Visit</p>
            </div>

            <div className="col-4 text-center">
              <img src="/images/best-price.jpg" alt="Best Price" />
              <p>Best Price</p>
            </div>

            <div className="col-12 mt-3">
              <p className="text-center offer-text">
                Register Here And Avail <span>The Best Offers!!</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="input-group form-group">
              <div className="input-group-text icon_back">
                <i className="fa-solid fa-user"></i>
              </div>
              <input
                name="fullName"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                placeholder="Full Name"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            {errors.fullName && <small className="text-danger ps-5 mb-2 d-block">{errors.fullName}</small>}

            {/* Phone */}
            <div className="input-group form-group">
              <div className="input-group-text icon_back">
                <i className="fa-solid fa-phone"></i>
              </div>
              <input
                name="phone"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="Phone Number"
                maxLength="10"
                type="text"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            {errors.phone && <small className="text-danger ps-5 mb-2 d-block">{errors.phone}</small>}

            {/* Email */}
            <div className="input-group form-group">
              <div className="input-group-text icon_back">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <input
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Email Id"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            {errors.email && <small className="text-danger ps-5 mb-2 d-block">{errors.email}</small>}

            {/* Message */}
            <div className="input-group form-group">
              <div className="input-group-text icon_back1">
                <i className="fa-solid fa-comments"></i>
              </div>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Message (if required)"
              ></textarea>
            </div>

            {!captchaVerified ? (
              <div className="mb-3 d-flex justify-content-center">
                <ReCAPTCHA
                  sitekey="6LfwBLcsAAAAAE9OJLjsfADD-Qtv90KStKVL22H3"
                  onChange={onCaptchaChange}
                  ref={recaptchaRef}
                />
              </div>
            ) : (
              <p className="text-success text-center">✓ Verified</p>
            )}

            {/* Hidden fields */}
            <input type="hidden" value="491" />
            <input type="hidden" value="JMC Broadway" />
            <input type="hidden" value="Residential" />

            {/* Submit */}
            <button
              className="form_btn"
              type="submit"
              disabled={!isFormValid}
            >
              Submit
            </button>

            <button
              type="button"
              className="disclaimer_btn"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                display: 'block',    // Allows the button to accept auto margins
                margin: '10px auto', // '10px' adds vertical spacing, 'auto' centers it horizontally
                color: '#722f83',    // Optional: match your theme's purple color
                fontSize: '13px'
              }}
              onClick={() => setShowDisclaimerModal(true)}
            >
              Read Disclaimer
            </button>
          </form>
        </div>
      </div>
      {/* NAVBAR */}
      <header className="head_nav">
        {/* <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand" href="/">
              <img src="/images/logo.webp" alt="logo" />
            </a>

            <ul className="navbar-nav ms-auto">
              <li><a className="nav-link" href="#">Home</a></li>
              <li><a className="nav-link" href="#amenities">Amenities</a></li>
              <li><a className="nav-link" href="#gallery">Gallery</a></li>
              <li><a className="nav-link" href="#floorplans">Floor Plans</a></li>
              <li><a className="nav-link" href="#siteplan">Site Plan</a></li>
              <li><a className="nav-link" href="#locationmap">Location Map</a></li>
              <li><a className="nav-link" href="#locationadvantage">Location Advantage</a></li>
              <li><a className="nav-link" href="tel:+91-9832064905" style={{
      backgroundColor: "#722f83",
      color: "#fff",
      borderRadius: "10px",
      fontWeight: "600",
      display: "inline-block",
      transition: "0.3s",
       
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = "#5a2468"}
    onMouseLeave={(e) => e.target.style.backgroundColor = "#722f83"}>Call Now</a></li>
            </ul>
          </div>
        </nav> */}
        <nav className="navbar navbar-expand-lg">
          <div className="container d-flex justify-content-between align-items-center">

            {/* LOGO */}
            <a className="navbar-brand" href="/">
              <img src="/images/logo.webp" alt="logo" />
            </a>

            <div className="d-lg-none text-center mt-2">
              <a href="tel:+919832064905" className="mobile-call-btn">
                <i className="fa-solid fa-phone me-2"></i> CALL NOW
              </a>
            </div>

            {/* HAMBURGER (ONLY MOBILE) */}
            <div className="hamburger d-lg-none" onClick={() => setMenuOpen(!menuOpen)}>
              <i className="fa-solid fa-bars"></i>
            </div>

            {/* DESKTOP MENU */}
            <ul className="navbar-nav ms-auto d-none d-lg-flex">
              <li><a className="nav-link" href="#">Home</a></li>
              <li><a className="nav-link" href="#amenities">Amenities</a></li>
              <li><a className="nav-link" href="#gallery">Gallery</a></li>
              <li><a className="nav-link" href="#floorplans">Floor Plans</a></li>
              {/* <li><a className="nav-link" href="#siteplan">Site Plan</a></li> */}
              <li><a className="nav-link" href="#locationmap">Location Map</a></li>
              <li><a className="nav-link" href="#locationadvantage">Location Advantage</a></li>

              {/* Desktop Call Button */}
              <li>
                <a
                  className="nav-link call-btn"
                  href="tel:+919832064905"
                >
                  <i className="fa-solid fa-phone me-0"></i> CALL NOW
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {menuOpen && (
          <div className="mobile-menu d-lg-none">
            <a href="#">Home</a>
            <a href="#amenities">Amenities</a>
            <a href="#gallery">Gallery</a>
            <a href="#floorplans">Floor Plans</a>
            {/* <a href="#siteplan">Site Plan</a> */}
            <a href="#locationmap">Location Map</a>
            <a href="#locationadvantage">Location Advantage</a>
          </div>
        )}


      </header>

      {/* BANNER */}
      <section className="banner_area">
        <img src="/images/banner.webp" alt="" />
        <div className="container">
          <h1>JMC Broadway</h1>
          <p>Discover the epitome of luxury living surrounded by nature</p>
          <h3>
            <i className="fa-solid fa-location-dot"></i> Saltlake Sector V
          </h3>
        </div>
      </section>

      {/* PRICE SECTION */}
      <section className="point_area" >
        <div className="container">
          <div className="row justify-content-center text-center">

            <div className="col-md-4">
              <div className="point_box d-flex align-items-center">

                {/* ICON */}
                <div className="point_icon">
                  <i className="fa-solid fa-building"></i>
                </div>

                {/* TEXT */}
                <div className="point_text" style={{
                  color: "#fff",
                }}>
                  <h3>2BHK</h3>
                  <h5>(1147- 1164 Sq. Ft.)</h5>
                  <h2>98 Lakhs</h2>
                  <p>Onwards*</p>
                </div>

              </div>
            </div>

            <div className="col-md-4">
              <div className="point_box d-flex align-items-center">

                {/* ICON */}
                <div className="point_icon">
                  <i className="fa-solid fa-building"></i>
                </div>

                {/* TEXT */}
                <div className="point_text" style={{
                  color: "#fff",
                }}>
                  <h3>3BHK</h3>
                  <h5>(1253 - 1792 Sq. Ft.)</h5>
                  <h2>1.30 Cr</h2>
                  <p>Onwards*</p>
                </div>

              </div>
            </div>


            <div className="btn_box">
              <a onClick={() => setShowModal(true)}>
                Download Brochure
              </a>
            </div>

          </div>
        </div>
      </section>
      <hr class="prophr"></hr>
      {/* OVERVIEW */}

      <section className="abt_back" id="overview">
        <div className="container">
          <div className="row">

            <div
              className="col-md-7 d-flex wow bounceInLeft"
              data-wow-delay="0.1s"
            >
              <div className="abt_left">
                <h2 className="head">Overview</h2>

                <p>
                  <strong>
                    Here are a few reasons why you should invest in this beautiful property:
                  </strong>
                </p>

                <ul>
                  <li>Proximity to nature, with a beautiful lake view.</li>
                  <li>Luxury living at an affordable price point.</li>
                  <li>Barbeque area for outdoor gatherings.</li>
                  <li>High-quality bathroom fittings.</li>
                  <li>Convenient location.</li>
                </ul>
                <p>
                  JMC Broadway, located in Saltlake Sector V, is a prestigious residential
                  property offering a range of 2BHK and 3BHK flats. It blends luxury
                  and affordability seamlessly, making it an attractive choice for
                  homebuyers.
                </p>
                {/* Hidden / Expand Content */}
                {readMore && (
                  <div className="moretext">
                    <p>
                      Residents can enjoy the serene beauty of a nearby lake, creating a
                      peaceful and refreshing ambiance. As the tallest property on BT
                      Road, residents get breathtaking views.
                    </p>

                    <p>
                      The property features premium fittings from brands like Jaquar
                      and Kohler. It also includes an aroma garden for relaxation.
                    </p>
                  </div>
                )}

                <div className="btn_box">
                  <button
                    className="moreless-button btn btn-link"
                    onClick={() => setReadMore(!readMore)}
                  >
                    {readMore ? "Read Less" : "Read More"}
                  </button>
                </div>

              </div>
            </div>

            <div className="col-md-5 d-flex">
              <div className="abt_right">
                <div
                  className="abt_img1 wow bounceInRight"
                  data-wow-delay="0.1s"
                >
                  <img
                    src="/images/abt_img.webp"
                    alt="Overview"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="amenities_area" id="amenities">
        <div className="container">

          <div className="row">
            <div className="col-md-12">
              <h2 className="head">Amenities</h2>
            </div>
          </div>

          {/* TOP 6 */}
          <div className="row">
            {[
              { img: "ame_icon1.webp", title: "24/7 Water Supply" },
              { img: "ame_icon2.webp", title: "Car Parking/Reserved Parking" },
              { img: "ame_icon3.webp", title: "CCTV Camera" },
              { img: "ame_icon14.webp", title: "Lift" },
              { img: "ame_icon22.webp", title: "Security" },
              { img: "ame_icon12.webp", title: "Gymnasium" },
              { img: "ame_icon16.webp", title: "Commercial Zone" },
              { img: "ame_icon7.webp", title: "Earthquake Resistance" },
              { img: "ame_icon8.webp", title: "Firefighting Systems" },
              { img: "ame_icon9.webp", title: "Flower Gardens" },
              { img: "ame_icon13.webp", title: "Intercom" },
              { img: "ame_icon15.webp", title: "Maintenance Staff" },
              { img: "ame_icon18.webp", title: "Patio or Balcony" },
              { img: "ame_icon19.webp", title: "Power Backup" },
              { img: "ame_icon21.webp", title: "Rain Water Harvesting" },
              { img: "ame_icon5.webp", title: "Vaastu Compliant" },
              { img: "ame_icon24.webp", title: "Visitor Parking" }
            ].map((item, index) => (
              <div
                className="col-lg-2 col-sm-4 col-6 d-flex wow bounceIn"
                data-wow-delay="0.1s"
                key={index}
              >
                <div className="ame_box">
                  <div className="ame_icon">
                    <img src={`/images/${item.img}`} alt="" />
                  </div>
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* MORE AMENITIES */}
          {showMoreAmenities && (
            <div className="moretext2">
              <div className="row">
                {[

                ].map((title, index) => (
                  <div
                    className="col-lg-2 col-sm-4 col-6 d-flex wow bounceIn"
                    data-wow-delay="0.1s"
                    key={index}
                  >
                    <div className="ame_box">
                      <div className="ame_icon">
                        <img src={`/images/ame_icon${index + 7}.webp`} alt="" />
                      </div>
                      <h3>{title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUTTON */}
          {/* <div className="row">
            <div className="col-md-12">
              <div className="btn_box text-center">
                <button
                  className="moreless-button2 btn btn-primary"
                  onClick={() => setShowMoreAmenities(!showMoreAmenities)}
                >
                  {showMoreAmenities ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>
          </div> */}

        </div>
      </section>

      {/* GALLERY */}
      {/* GALLERY */}
      <section className="gallery_area" id="gallery">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="head">Gallery</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="gallery_slide">
                {/* LightGallery wraps the Slider */}
                <LightGallery
                  speed={500}
                  plugins={[lgThumbnail, lgZoom]}
                  elementClassNames="custom-wrapper-class"
                  // Important: This tells LightGallery to look for these links specifically
                  selector=".gallery-item"
                >
                  <Slider {...gallerySettings}>
                    {[1, 2, 3].map((img, index) => (
                      <div className="item" key={index}>
                        <div className="gallerylight_box" style={{ padding: "0 10px" }}>
                          <div className="gal_box">
                            {/* Added className="gallery-item" to match the selector above */}
                            <a
                              href={`/images/gallery${img}.webp`}
                              className="gallery-item"
                              data-src={`/images/gallery${img}.webp`}
                            >
                              <img
                                className="img-fluid"
                                src={`/images/gallery${img}.webp`}
                                alt={`Gallery ${img}`}
                                style={{ width: "100%", borderRadius: "8px", cursor: "pointer" }}
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </LightGallery>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOOR PLANS */}
      <section className="floor_area" id="floorplans">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="head">Floor Plans</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <article className="tabbed-content">
                <div className="row">
                  {/* LEFT TAB MENU */}
                  <div className="col-lg-3 col-sm-4">
                    <nav>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {["Basement Floor", "Ground Floor", "3rd Floor", "4-9th Floor", "10th Floor", "11th Floor"].map((tab) => (
                          <li key={tab} style={{ marginBottom: "15px" }}>
                            <button
                              onClick={() => setActiveTab(tab)}
                              style={{
                                width: "100%",
                                padding: "15px",
                                fontSize: "18px",
                                fontWeight: "600",
                                border: "none",
                                cursor: "pointer",
                                textAlign: "left",
                                background: activeTab === tab ? "#722f83" : "#ddd",
                                color: activeTab === tab ? "#fff" : "#000",
                                borderRadius: "4px",
                                position: "relative"
                              }}
                            >
                              {tab.toUpperCase()}
                              {activeTab === tab && (
                                <span style={{
                                  position: "absolute", right: "-10px", top: "50%",
                                  transform: "translateY(-50%)", width: "0", height: "0",
                                  borderTop: "10px solid transparent", borderBottom: "10px solid transparent",
                                  borderLeft: "10px solid #722f83"
                                }}></span>
                              )}
                            </button>

                            {/* MOBILE VIEW IMAGE: Shows right below the button on small screens */}
                            {activeTab === tab && (
                              <div className="d-block d-sm-none mt-3">
                                <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
                                  <a href={getImagePath(tab)}>
                                    <img
                                      src={getImagePath(tab)}
                                      className="img-fluid"
                                      alt={tab}
                                      style={{ cursor: "pointer", borderRadius: "8px", border: "1px solid #722f83" }}
                                    />
                                  </a>
                                </LightGallery>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>

                  {/* DESKTOP CONTENT: Hidden on mobile to avoid duplication */}
                  <div className="col-lg-9 col-sm-8 d-none d-sm-block">
                    <div className="item">
                      <div className="row align-items-center">
                        <div className="col-md-12">
                          <div className="bhk_details">
                            <h3>{activeTab}</h3>
                          </div>
                          <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
                            <a href={getImagePath(activeTab)}>
                              <img
                                src={getImagePath(activeTab)}
                                className="img-fluid"
                                alt={activeTab}
                                style={{ cursor: "pointer" }}
                              />
                            </a>
                          </LightGallery>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <hr class="prophr"></hr>

      {/* <section className="site_area" id="siteplan">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="head">Site Plan</h2>
            </div>
            <div
              className="col-md-8 offset-md-2 wow fadeInDown"
              data-wow-delay="0.1s"
            >
              <div className="site_light">          
          <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
            <a href="/images/site_plan.webp">
              <img
                className="img-responsive"
                src="/images/site_plan.webp"
                alt="Site Plan"
                style={{ cursor: "pointer", width: '100%' }}
              />
            </a>
          </LightGallery>
        </div>
            </div>

          </div>
        </div>
      </section> */}

      <hr class="prophr"></hr>

      <section className="site_area location_area" id="locationmap">
        <div className="container">
          <div className="row">

            <div className="col-md-12">
              <h2 className="head">Location Map</h2>
            </div>

            <div
              className="col-md-8 offset-md-2 wow fadeInDown"
              data-wow-delay="0.1s"
            >
              <div className="site_light">
                {/* Wrap with LightGallery */}
                <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
                  <a href="/images/map_img.webp">
                    <img
                      className="img-responsive"
                      src="/images/map_img.webp"
                      alt="Location Map"
                      style={{ cursor: "pointer", width: '100%' }}
                    />
                  </a>
                </LightGallery>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="loc_adv_area" id="locationadvantage">
        <div className="container">

          <div className="row">
            <div className="col-md-12">
              <h2 className="head">Location Advantage</h2>
            </div>
          </div>

          <div className="row">
            {locations.map((item, index) => (
              <div
                className="col-lg-3 col-sm-4 wow zoomIn"
                data-wow-delay="0.1s"
                key={index}
              >
                <div className="loc_box">
                  <i className={`fa-solid ${item.icon}`}></i>

                  <div className="loc_details">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCLAIMER POPUP MODAL */}
      {showDisclaimerModal && (
        <div className="modal fade show modal_body_area d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ background: '#722f83', color: '#fff' }}>
                <h5 className="modal-title">Disclaimer</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDisclaimerModal(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ padding: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                <p>
                  The data (based on the search query performed), on the webpages of jmcbroadway.com has been made available for informational purposes only and no representation or warranty is expressly or impliedly given as to its accuracy. Any investment decisions that you take should not be based relying solely on the information that is available on the website jmcbroadway.com or downloaded from it. Nothing contained herein shall be deemed to constitute legal advice, solicitation, invitation to acquire by the developer/builder or any other entity.

                  You are advised to visit the relevant HIRA / RERA website directly to know more about the project and check all the information before taking any decision based on the contents displayed on the website jmcbroadway.com. If you have any question or want to share feedback, feel free to write to us at 510earthdotcom@gmail.com. Trademarks belong to the respective owners.Please note, that we will not be accepting any bookings or allotments based on the images, material, stock photography, projections, details, descriptions that are currently available and/or displayed on the Website. We advise you to contact our Support Team for further information.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDisclaimerModal(false)}
                  style={{ background: '#722f83', border: 'none' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="abt_back" id="disclaimer">
        <div className="container">
          <div className="row">
            <div
              className="col-md-12 d-flex wow bounceInLeft"
              data-wow-delay="0.1s"
            >
              <div className="abt_left autho_area">

                <h2 className="head">Authorised Channel Partner</h2>

                <h3>WBRERA/A/SOU/2023/000185</h3>

                <ul>
                  <li>
                    Phone:
                    <a href="tel:+919832064905">
                      <b>( +91 ) 9832064905</b>
                    </a>
                  </li>
                  <li>
                    This site is for information purpose only and should not be treated as the official information.
                  </li>
                  <li>
                    Project RERA Registration No:{" "}
                    <b>WBRERA/P/NOR/2024/001096</b>
                  </li>
                </ul>
                <p>
                  Disclaimer: The information provided is for reference purposes only and does not constitute an offer to use any of our services. The prices mentioned are subject to change without prior notice, and the availability of the properties may vary. The images provided are for illustrative purposes only. This is the official website of our authorized marketing partner. We may share your data with RERA-registered brokers or companies for further processing. Moreover, we may send you updates to the email ID or mobile number registered with us. All rights are reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="footer_area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul>
                <li>
                  <Link to="/privacypolicy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/termsofuse">Terms Of Use</Link>
                </li>
              </ul>
              <div className="copy_area">
                <div className="row">
                  <div className="col-md-6">
                    <p>© 2026-27 JMC Broadway. All rights reserved.</p>
                  </div>

                  <div className="col-md-6">
                    <p className="copy_right">
                      Design & Developed by Teesta Networks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id="whatsAppDiv" className="whatsapp_area">
        <a
          href="https://api.whatsapp.com/send?phone=919832064905&text=Hi there, Interest In JMC Broadway Property!"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/images/whatsapp_btn.png" alt="WhatsApp" />
        </a>
      </div>
      {/* POPUP MODAL */}
      {/* BUTTON TO OPEN MODAL */}
      {/* <button className="btn btn-primary" onClick={() => setShowModal(true)}>
  Open Brochure Form
</button> */}

      {/* MODAL */}
      {showModal && (
        <div className="modal fade show modal_body_area d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              {/* HEADER */}
              <div className="modal-header">
                <div className="row w-100">
                  <div className="col-md-4">
                    <div className="modal_logo">
                      <img src="/images/logo.webp" alt="JMC Broadway" />
                    </div>
                  </div>

                  <div className="col-md-8">
                    <h6 className="modal-head">
                      Are you interested about <span>JMC Broadway?</span>
                    </h6>
                  </div>
                </div>

                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetDownloadForm();
                  }}
                ></button>
              </div>

              {/* BODY */}
              <div className="modal-body modal-body-grey">

                {/* TOP ICONS */}
                <div className="row text-center">
                  <div className="col-4">
                    <img src="/images/call_back.jpg" alt="" />
                    <p>Instant Call Back</p>
                  </div>

                  <div className="col-4">
                    <img src="/images/free-site-vist.jpg" alt="" />
                    <p>Free Site Visit</p>
                  </div>

                  <div className="col-4">
                    <img src="/images/best-price.jpg" alt="" />
                    <p>Best Price</p>
                  </div>

                  <div className="col-12 mt-3">
                    <p className="offer-text">
                      Register Here And Avail <span>The Best Offers!!</span>
                    </p>
                  </div>
                </div>

                {/* FORM */}
                <form onSubmit={handleDownloadSubmit}>
                  <div className="row">

                    {/* NAME */}
                    <div className="col-md-12 mb-2">
                      <input
                        name="fullName"
                        className={`form-control ${downloaderrors.fullName ? 'is-invalid' : ''}`}
                        placeholder="Full Name"
                        type="text"
                        value={formDownloadData.fullName}
                        onChange={handleInputDownloadChange}
                      />
                    </div>
                    {downloaderrors.fullName && <small className="text-danger ps-5 mb-2 d-block">{downloaderrors.fullName}</small>}


                    {/* PHONE */}
                    <div className="col-md-6 mb-2">
                      <input
                        name="phone"
                        className={`form-control ${downloaderrors.phone ? 'is-invalid' : ''}`}
                        placeholder="Phone Number"
                        maxLength="10"
                        type="text"
                        value={formDownloadData.phone}
                        onChange={handleInputDownloadChange}
                      />
                    </div>
                    {downloaderrors.phone && <small className="text-danger ps-5 mb-2 d-block">{downloaderrors.phone}</small>}

                    {/* EMAIL */}
                    <div className="col-md-6 mb-2">
                      <input
                        name="email"
                        className={`form-control ${downloaderrors.email ? 'is-invalid' : ''}`}
                        placeholder="Email Id"
                        type="email"
                        value={formDownloadData.email}
                        onChange={handleInputDownloadChange}
                      />
                    </div>
                    {downloaderrors.email && <small className="text-danger ps-5 mb-2 d-block">{downloaderrors.email}</small>}

                    {/* MESSAGE */}
                    <div className="col-md-12 mb-2">
                      {/* <textarea
                        className="form-control"
                        placeholder="Message"
                        rows="2"
                      ></textarea> */}
                      <textarea
                        name="message"
                        className="form-control"
                        rows="2"
                        placeholder="Message (if required)"
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* HIDDEN FIELDS */}
                    <input type="hidden" value="491" />
                    <input type="hidden" value="JMC Broadway" />
                    <input type="hidden" value="Residential" />
                    <input type="hidden" value="Flat/Apartment" />
                    {/* SUBMIT */}
                    <div className="col-md-12 text-center mt-2">
                      <button className="form_btn" type="submit">
                        Submit & Download
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      {/* <footer className="footer_area text-center">
        <p>© 2024 JMC Broadway. All rights reserved.</p>
      </footer> */}
    </>
  );
}
