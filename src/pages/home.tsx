import Hero from "../components/hero.tsx";
import Nav from "../components/nav.tsx"
const Home = () => {
  return(
    <div className="overflow-hidden">
      <Nav />
      <Hero />
    </div>
  )
}
export default Home