import Nav from "../components/nav.tsx"
import Hero from "../components/hero.tsx";
import WhyUs from "../components/whyUs.tsx";
import Faqs from "../components/faqs.tsx";
import Footer from "../components/footer.tsx";

const Home: React.FC = () => {
  return(
    <div className="overflow-hidden w-full">
      <Nav />
      <Hero />
      <WhyUs />
      <Faqs />
      <Footer />
    </div>
  )
}
export default Home