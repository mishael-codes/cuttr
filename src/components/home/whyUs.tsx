// ****************** firebase imports
import auth from "../../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

// ****************** React Feather
import * as Icon from "react-feather";

// ******************  React Router
import { Link } from "react-router-dom";

// ****************** React Hooks
import { useState, useEffect } from "react";

// ****************** Icon Imports
import qrCode from "../../assets/icons/qrcode.svg";

const WhyUs: React.FC = () => {
  const [getStartedLink, setGetStartedLink] = useState<string>("");
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setGetStartedLink(user ? "/dashboard" : "/signup");
    });
  }, []);

  const reasons = [
    {
      icon: <Icon.Share2 className="text-accent group-hover:text-white transition-colors" size={32} />,
      title: "Shareability",
      desc: "Cuttr links are snappy and shareable, making them easy to share on social media platforms.",
    },
    {
      icon: <Icon.Zap className="text-accent2 group-hover:text-white transition-colors" size={32} />,
      title: "Fast",
      desc: "Cuttr links are concise and load faster than long URLs, improving user experience.",
    },
    {
      icon: <Icon.Edit className="text-accent group-hover:text-white transition-colors" size={32} />,
      title: "Customizable",
      desc: "You can customize your links to be more appealing to your audience and promote your brand.",
    },
    {
      icon: <Icon.Activity className="text-accent2 group-hover:text-white transition-colors" size={32} />,
      title: "Analytics",
      desc: "Cuttr provides analytic tools with which you can track the performance of your links. Figure out what works.",
    },
    {
      icon: <img src={qrCode} className="w-8 h-8 filter invert brightness-0 sepia-0 saturate-100 hue-rotate-0 group-hover:brightness-200 transition-all" alt="QR Code" />,
      title: "QR Codes",
      desc: "Cuttr provides QR codes for your links, making it easier for your audience to access your content.",
    },
    {
      icon: <Icon.DollarSign className="text-accent group-hover:text-white transition-colors" size={32} />,
      title: "Affordable",
      desc: "Cuttr has different pricing plans to suit your needs. You can choose between free and paid plans.",
    },
  ];

  return (
    <div className="w-full py-24 px-5 flex flex-col items-center relative">
      <div id="whyUs" className="absolute -top-24"></div>
      
      <div className="text-center mb-16">
        <h3 className="font-display font-bold text-4xl mb-4">Why Choose Cuttr</h3>
        <div className="h-1 w-20 bg-gradient-to-r from-accent to-accent2 mx-auto rounded-full"></div>
        <p className="text-text-muted mt-4 max-w-xl text-lg">Everything you need to manage your links effectively.</p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4">
        {reasons.map((reason, idx) => (
          <div
            key={reason.title}
            className="group glass-card rounded-2xl p-8 flex flex-col hover:-translate-y-2 hover:shadow-neon transition-all duration-300 border border-white/5 hover:border-accent/30"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-light/50 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-accent2 transition-all duration-300">
              {reason.icon}
            </div>
            <h4 className="text-xl font-display font-bold text-white mb-3">{reason.title}</h4>
            <p className="text-text-muted leading-relaxed">{reason.desc}</p>
          </div>
        ))}
      </div>

      <Link to={getStartedLink} className="mt-16 group">
        <button className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-surface-light to-surface font-semibold text-white border border-white/10 hover:border-accent/50 hover:shadow-neon transition-all duration-300">
          <span>Get Started Now</span>
          <Icon.ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  );
};

export default WhyUs;
