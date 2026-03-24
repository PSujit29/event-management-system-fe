import Hero from "@/components/Hero/Hero";
import { Users, Briefcase, Link as LinkIcon } from "lucide-react";
import eventSample1 from "@/assets/images/event-sample-1.avif";
import eventSample2 from "@/assets/images/event-sample-2.avif";
import eventSample3 from "@/assets/images/event-sample-3.avif";

export const HeroSection = () => {
  const heroData = {
    title: (<>Plan, Promote <br /> & Host Better Events</>),
    subtitle: "Everything you need to manage registrations, schedules, and attendee communication in one place.",
    actions: [
      { text: "Book your event now", onClick: () => alert("Join the Class clicked!"), variant: "default" },
      { text: "Learn more", onClick: () => alert("Learn More clicked!"), variant: "outline" },
    ],
    stats: [
      { value: "150 +", label: "Successful Events", icon: <Users className="h-5 w-5 text-muted-foreground" /> },
      { value: "25 +", label: "Organizers", icon: <Briefcase className="h-5 w-5 text-muted-foreground" /> },
      { value: "Resources", label: "", icon: <LinkIcon className="h-5 w-5 text-muted-foreground" /> },
    ],
    images: [eventSample1, eventSample2, eventSample3],
  };

  return (
    <div className="w-full bg-background">
      <Hero
        title={heroData.title}
        subtitle={heroData.subtitle}
        actions={heroData.actions}
        stats={heroData.stats}
        images={heroData.images}
        className="p-10"
      />
    </div>
  );
};
