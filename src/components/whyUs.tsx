import * as Icon from "react-feather";

const WhyUs: React.FC = () => {
  const reasons = [
    {
      
      icon:  <Icon.Share2 size="50px" />,
      title: "Shareability",
      desc: "Cuttr links are snappy and shareable, making them easy to share on social media platforms.",
    },
    {
      icon: <Icon.Zap size="50px" />,
      title: "Fast",
      desc: "Cuttr links are concise and load faster than long URLs, improving user experience.",
    },
    {
      icon: <Icon.Edit size="50px" />,
      title: "Customizable",
      desc: "You can customize your links to be more appealing to your audience and promote your brand.",
    },
    {
      icon: <Icon.Activity size="50px" />,
      title: "Analytics",
      desc: "Cuttr provides analytic toolswithh which you can track the performance of your links with. Figure out what's working and what's not.",
    },
    {
      icon: <Icon.DollarSign size="50px" />,
      title: "Free",
      desc: "Cuttr is free to use and doesn't require any sign-up. Just shorten your link and share! However, you need to sign up to access analytics.",
    },
  ];

  return (
    <div className="flex items-center justify-center flex-col w-screen">
      <div id="whyUs" className="w-[50px] h-[50px]"></div>
      <h3 className="text-text font-semibold text-2xl relative z-30 after:content-[''] after:absolute after:w-1/4 after:h-[3px] after:bg-accent after:-z-10 after:left-[50%] after:translate-x-[-50%] after:top-8 after:rounded-lg">
        Why Cuttr
      </h3>
      <div className="w-fit mt-14 grid place-items-center justify-center gap-5 md:gap-7 md:grid-cols-2 lg:grid-cols-3 shadow-[5px_5px_20px_rgba(25, 5, 44,1)]">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="flex items-center justify-center flex-col w-80 h-80 p-4 bg-accent rounded-lg shadow-md text-background"
          >
            {reason.icon}
            <h2 className="my-3 text-2xl font-bold">{reason.title}</h2>
            <p className="text-center">{reason.desc}</p>
          </div>
        ))}
      </div>
      <a href="">
        <button className="flex items-center justify-center mt-10 rounded-lg w-80 bg-shadow font-bold text-accent p-3 border border-accent hover:bg-transparent hover:translate-x-[20px] hover:text-accent transition-all">
          Get Started
          <Icon.ChevronsRight className="ml-2" />
        </button>
      </a>
    </div>
  );
};

export default WhyUs;
