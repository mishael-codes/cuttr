import * as Icon from "react-feather";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-24 border-t border-white/5 bg-surface/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <span className="font-display font-bold tracking-tight text-2xl text-gradient">Cuttr</span>
              <Icon.Link className="text-accent group-hover:rotate-12 transition-transform duration-300" size={24} />
            </Link>
            <p className="text-text-muted max-w-sm">
              The modern URL shortener designed for speed, reliability, and powerful analytics.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-text-muted">
              <li><a href="#whyUs" className="hover:text-accent transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-accent transition-colors">Pricing</a></li>
              <li><a href="#faqs" className="hover:text-accent transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-text-muted">
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-text-muted text-sm">
          <p>&copy; {new Date().getFullYear()} Cuttr. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors"><Icon.Twitter size={20} /></a>
            <a href="#" className="hover:text-accent transition-colors"><Icon.GitHub size={20} /></a>
            <a href="#" className="hover:text-accent transition-colors"><Icon.Linkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
