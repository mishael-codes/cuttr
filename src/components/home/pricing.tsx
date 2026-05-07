import * as Icon from "react-feather"

const Pricing: React.FC = () => {
  return (
    <div className="w-full py-24 px-5 flex flex-col items-center relative">
      <div id="pricing" className="absolute -top-24"></div>
      
      <div className="text-center mb-16">
        <h3 className="font-display font-bold text-4xl mb-4">Pricing Plans</h3>
        <div className="h-1 w-20 bg-gradient-to-r from-accent to-accent2 mx-auto rounded-full"></div>
        <p className="text-text-muted mt-4 max-w-xl text-lg">Choose the perfect plan that fits your needs.</p>
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 lg:gap-12 px-4">
        {/* Basic Plan */}
        <div className="glass-card rounded-3xl p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300">
          <div className="mb-8">
            <h4 className="font-display font-bold text-2xl text-text-muted mb-2">Basic</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-text-muted font-medium">/mo</span>
            </div>
            <p className="text-sm text-text-muted mt-4">Perfect for individuals getting started.</p>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['Create an account', 'Shorten up to 5 links', 'Basic analytics', 'QR Codes generation'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-text">
                <Icon.CheckCircle className="text-accent shrink-0" size={20} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button className="w-full py-4 rounded-xl border border-white/10 font-semibold hover:bg-surface-light transition-colors">
            Get Started Free
          </button>
        </div>

        {/* Premium Plan */}
        <div className="glass-card rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-300 border-accent/50 shadow-neon">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent to-accent2 rounded-t-3xl"></div>
          <div className="absolute -top-4 right-8 bg-gradient-to-r from-accent to-accent2 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </div>
          
          <div className="mb-8">
            <h4 className="font-display font-bold text-2xl text-accent mb-2">Premium</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold">$5</span>
              <span className="text-text-muted font-medium">/mo</span>
            </div>
            <p className="text-sm text-text-muted mt-4">For power users and growing brands.</p>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['Everything in Basic', 'Unlimited link shortening', 'Advanced analytics dashboard', 'Custom link domains', 'Priority support'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-text">
                <Icon.CheckCircle className="text-accent2 shrink-0" size={20} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button className="w-full py-4 rounded-xl bg-gradient-to-r from-accent to-accent2 text-white font-semibold shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
