import "./featureSection.css";
import FeatureCard from "../featureCard/featureCard";
import { MdNotifications, MdBarChart, MdLock } from "react-icons/md";

export default function FeatureSection() {
  return (
    <section className="feature-section-wrapper">
      <h2 className="section-heading">Features</h2>
      <div className="features-container">
        <FeatureCard
          icon={<MdNotifications size={32} color="#1cc73b" />}
          title="Payment Reminders"
          description="Track, manage, and never miss a payment. Get automated reminders before your subscriptions are due."
        />
        <FeatureCard
          icon={<MdBarChart size={32} color="#1cc73b" />}
          title="Spending Analytics"
          description="View detailed statistics on your monthly spending. Identify and eliminate unnecessary expenses."
        />
        <FeatureCard
          icon={<MdLock size={32} color="#1cc73b" />}
          title="Secure & Private"
          description="Your financial data is encrypted and kept secure. We never share or sell your personal subscription details."
        />
      </div>
    </section>
  );
}
