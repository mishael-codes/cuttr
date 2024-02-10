import Nav from "../components/nav.tsx"
import Hero from "../components/hero.tsx";
import WhyUs from "../components/whyUs.tsx";
import Faqs from "../components/faqs.tsx";

const Home = () => {
  return(
    <div className="overflow-hidden w-full">
      <Nav />
      <Hero />
      <WhyUs />
      <Faqs />
    </div>
  )
}
export default Home