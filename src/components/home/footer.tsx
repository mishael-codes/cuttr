import ogCuttr from "../../assets/icons/og-Cuttr.png"

const Footer: React.FC = () => {
  return (
    <div className="mt-24">
      <div className="w-full h-20 bg-accent flex items-center justify-between px-2 text-background">
        <p className="font-semibold">&copy; 2021 Cuttr. All Rights Reserved</p>
        <img src={ogCuttr} alt="Cuttr logo" className="justify-self-end rounded-lg" />
      </div>
    </div>
  );
};

export default Footer;
