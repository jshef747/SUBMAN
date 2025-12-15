import "./MainBody.css";
import homepageImage from "../../assets/homepage-image-changed.jpg";

export default function MainBody() {
  return (
    <div className="main-body-wrapper">
      <div className="main-text-wrapper">
        <h1>Simplify your Subscriptions</h1>
        <p>
          Track and manage all your subscriptions in one place. Never forget a
          payment again
        </p>
        <button className="get-started">Get Started For Free</button>
      </div>
      <div className="main-image-wrapper">
        <img
          src={homepageImage}
          alt="Homepage Illustration"
          className="main-image"
        />
      </div>
    </div>
  );
}
