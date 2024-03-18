import * as Icon from "react-feather"

const Pricing: React.FC = () => {
  return (
    <div className="w-screen h-fit p-5 flex flex-col items-center justify-around">
      <div id="pricing" className="w-[50px] h-[50px]"></div>
      <h3 className="text-text font-semibold text-2xl relative z-30 after:content-[''] after:absolute after:w-1/4 after:h-[3px] after:bg-accent after:-z-10 after:left-[50%] after:translate-x-[-50%] after:top-8 after:rounded-lg">
        Pricing
      </h3>
      <div className="w-[70%] md:flex items-center justify-evenly mt-14">
        <div className="w-[300px] md:w-[320px] flex flex-col bg-transparent border-2 border-accent py-12 px-5 rounded-lg">
          <h4 className="font-bold text-accent uppercase">Basic</h4>
          <p className="text-text">0$/mo</p>
          <div className="text-text">
            <p className="mt-3">On our basic plan, you can...</p>
            <ul className="mt-5 font-medium">
              <li className="flex items-center justify-start my-5"><Icon.CheckCircle className="mr-2" size="25px" /> Create an account</li>
              <li className="flex items-center justify-start my-5"><Icon.CheckCircle className="mr-2" size="25px" /> Shorten up to 5+ links</li>
              <li className="flex items-center justify-start my-5"><Icon.CheckCircle className="mr-2" size="25px" /> Get basic analytics</li>
              <li className="flex items-center justify-start my-5"><Icon.CheckCircle className="mr-2" size="25px" /> Get QR Codes</li>
            </ul>
          </div>
        </div>
        <div className="w-[320px] flex flex-col bg-accent border-2 border-background py-12 px-5 rounded-lg">
          <h4 className="font-bold text-background uppercase">Premium</h4>
          <p>5$/mo</p>
          <div>
            <p className="mt-3">On our premium plan, you can...</p>
            <ul className="mt-5 font-medium">
              <li className="flex items-center justify-start my-5"><Icon.CheckCircle className="mr-2" size="25px" /> Create an account</li>
              <li className="flex items-center justify-start my-5"><Icon.CheckCircle className="mr-2" size="25px" /> Shorten links with no limits</li>
              <li className="flex items-center justify-start my-5"><Icon.CheckCircle className="mr-2" size="25px" /> Get enhanced analytics</li>
              <li className="flex items-center justify-start my-5"><Icon.CheckCircle className="mr-2" size="25px" /> Get QR Codes</li>
              <li className="flex items-center justify-start my-5"><Icon.CheckCircle className="mr-2" size="25px" /> Get links with custom domains</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
