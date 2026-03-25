import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { HeroSection } from "../../components/Hero/HeroSection";
import LandingFeature from "../../components/feature/LandingFeature";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <LandingFeature />
      <Footer />
    </>
  );
}
