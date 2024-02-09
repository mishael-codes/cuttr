const WhyUs = () => {
  const reasons = [
    {
      title: "Shareability",
      desc: "Cuttr links are snappy and shareable, making them easy to share on social media platforms.",
    },
    {
      title: "Fast",
      desc: "Cuttr links are concise and load faster than long URLs, improving user experience.",
    },
    {
      title: "Customizable",
      desc: "You can customize your links to be more appealing to your audience and promote your brand.",
    },
    {
      title: "Analytics",
      desc: "Cuttr provides analytic toolswithh which you can track the performance of your links with. Figure out what's working and what's not.",
    },
    {
      title: "Free",
      desc: "Cuttr is free to use and doesn't require any sign-up. Just shorten your link and share! However, you need to sign up to access analytics.",
    },
  ];

  return (
    <div className="flex items-center justify-center flex-col w-screen">
      <div id="whyUs" className="w-[50px] h-[50px]"></div>
      <h1 className="text-text font-semibold text-2xl relative z-30 after:content-[''] after:absolute after:w-1/4 after:h-[5px] after:bg-accent after:-z-10 after:left-11 after:top-7">
        Why Cuttr
      </h1>
      <div className="w-fit mt-14 grid place-items-center justify-center gap-5 md:gap-16 md:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="flex items-center justify-center flex-col w-96 h-96 p-4 bg-accent rounded-lg shadow-md text-background"
          >
            <h2 className="text-2xl font-bold">{reason.title}</h2>
            <p className="text-center">{reason.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyUs;
