import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Offers from "../components/Offers";
import Promotions from "../components/Promotions";
import Services from "../components/Services";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import Gallery from "../components/Gallery";
import Footer from "../components/footer";

function Home() {
  return (
    <>
      <Header />
      <Navbar />

      <Hero />

      <Offers />

      <Promotions />

      <Services />

      <WhyChoose />

      <Testimonials />

      <Gallery />

      <Footer />
    </>
  );
}

export default Home;