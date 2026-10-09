import Team from "@/components/shadcn-space/blocks/team-01/team";
import AppleDockDemo from "@/components/AppleDock";

const Team01 = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-neutral-800 selection:text-white pt-8 pb-32">
      {/* Team Content */}
      <Team />

      {/* Floating Apple Menu Dock with Names */}
      <AppleDockDemo activeTab="team" />
    </div>
  );
};

export default Team01;
