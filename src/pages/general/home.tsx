// ****************** Component Imports
import Nav from "../../components/home/nav.tsx";
import Hero from "../../components/home/hero.tsx";
import WhyUs from "../../components/home/whyUs.tsx";
import Faqs from "../../components/home/faqs.tsx";
import Footer from "../../components/home/footer.tsx";

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden w-full">
      <Nav />
      <Hero />
      <WhyUs />
      <Faqs />
      <Footer />
    </div>
  );
};
export default Home;
