import "./featureSection.css";
import FeatureCard from "../featureCard/featureCard";

export default function FeatureSection() {
  return (
    <section className="feature-section-wrapper">
      <h2 className="section-heading">Features</h2>
      <div className="features-container">
        <FeatureCard
          icon={<span>&#128197;</span>}
          title="Payment Reminders"
          description="Track, manage, and never miss a payment. Get automated reminders before your subscriptions are due."
        />

        <FeatureCard
          icon={<span>&#128200;</span>}
          title="Spending Analytics"
          description="View detailed statistics on your monthly spending. Identify and eliminate unnecessary expenses."
        />

        <FeatureCard
          icon={<span>&#128274;</span>}
          title="Secure & Private"
          description="Your financial data is encrypted and kept secure. We never share or sell your personal subscription details."
        />
      </div>
    </section>
  );
}
