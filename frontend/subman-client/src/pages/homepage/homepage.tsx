import MainBody from "./components/mainBody/MainBody";
import FeatureSection from "./components/featureSection/featureSection";
import "./homepage.css";

export default function HomePage() {
  return (
    <div className="homepage-container">
      <MainBody />
      <FeatureSection />
    </div>
  );
}
