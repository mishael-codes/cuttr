// ****************** React Feather
import * as Icon from "react-feather";
import { useState } from "react";

const Faqs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleContent = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Cuttr?",
      answer:
        "Cuttr is a free URL shortening service that allows you to shorten any URL. You can also track the performance of your shortened URLs with our analytic tools.",
    },
    {
      question: "How do I shorten a URL?",
      answer:
        "You can shorten a URL by pasting it in the input field on the homepage and clicking the 'Shorten' button. You can also customize the shortened URL if you want.",
    },
    {
      question: "How can I get Analytics?",
      answer:
        "You can track the performance of your shortened URLs by signing up and accessing the analytics dashboard. You can see the number of clicks, location of clicks, and more.",
    },
    {
      question: "Is Cuttr free to use?",
      answer:
        "Yes, Cuttr is free to use. You can shorten URLs without signing up. However, you need to sign up to access the analytics dashboard.",
    },
    {
      question: "How do I customize a URL?",
      answer:
        "You can customize a URL entering a custom alias for the URL before shortening. This is only avaiable if you're signed in.",
    },
    {
      question: "How do I get started?",
      answer:
        "You can get started by shortening a URL on the homepage. You can also sign up to access the analytics dashboard.",
    },
  ];

  return (
    <div className="w-full py-24 px-5 flex flex-col items-center relative">
      <div id="faqs" className="absolute -top-24"></div>
      
      <div className="text-center mb-16">
        <h3 className="font-display font-bold text-4xl mb-4">Frequently Asked Questions</h3>
        <div className="h-1 w-20 bg-gradient-to-r from-accent to-accent2 mx-auto rounded-full"></div>
        <p className="text-text-muted mt-4 max-w-xl text-lg">Got questions? We've got answers.</p>
      </div>

      <div className="w-full max-w-3xl space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={faq.question} 
              className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 border ${isOpen ? 'border-accent/30 shadow-neon' : 'border-white/5'}`}
            >
              <div
                onClick={() => toggleContent(index)}
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <h4 className={`font-semibold text-lg transition-colors ${isOpen ? 'text-accent' : 'text-text'}`}>
                  {faq.question}
                </h4>
                <div className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-accent/20 text-accent' : 'bg-surface text-text-muted'}`}>
                  <Icon.ChevronDown size={20} />
                </div>
              </div>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="p-6 pt-0 text-text-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faqs;
