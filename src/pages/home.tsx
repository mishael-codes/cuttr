import Nav from "../components/nav.tsx"
import Hero from "../components/hero.tsx";
import WhyUs from "../components/whyUs.tsx";
const Home = () => {
  return(
    <div className="overflow-hidden w-full">
      <Nav />
      <Hero />
      <WhyUs />
    </div>
  )
}
export default Home