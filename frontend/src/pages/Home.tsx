import { SectionPage } from "../components/SectionPage";
import { TonightCard } from "../components/Bedtime";

export default function Home() {
  return (
    <SectionPage sectionId="home">
      <TonightCard />
    </SectionPage>
  );
}
