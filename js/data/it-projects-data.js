/* ==========================================================================
   Business Empire: IT Software Studio Projects & Staffing Data
   Hire Devs, Designers, QA, and launch high-ticket commercial software
   ========================================================================== */

export const IT_STAFF_ROLES = [
  { id: "dev", name: "Senior Full-Stack Developer", salaryPerHour: 120, outputContribution: 25 },
  { id: "designer", name: "Lead UX/3D Designer", salaryPerHour: 95, outputContribution: 20 },
  { id: "qa", name: "Automation QA Specialist", salaryPerHour: 75, outputContribution: 15 },
  { id: "lead", name: "Principal System Architect", salaryPerHour: 220, outputContribution: 40 }
];

export const IT_PROJECTS = [
  {
    id: "proj-messenger",
    name: "Encrypted Cloud Messenger",
    requiredPoints: 500,
    completionPayout: 180000,
    requiredRoleIds: ["dev", "designer"],
    description: "End-to-end zero-knowledge messaging service with peer-to-peer file sharing."
  },
  {
    id: "proj-mobile-game",
    name: "AAA 3D Cyberpunk Mobile RPG",
    requiredPoints: 1800,
    completionPayout: 850000,
    requiredRoleIds: ["dev", "designer", "qa"],
    description: "High-fidelity real-time cross-platform gaming blockbuster with global live ops."
  },
  {
    id: "proj-cloud-erp",
    name: "Hyperscale Enterprise ERP Suite",
    requiredPoints: 6000,
    completionPayout: 4200000,
    requiredRoleIds: ["dev", "designer", "qa", "lead"],
    description: "Multinational conglomerate resource orchestration platform with real-time analytics."
  },
  {
    id: "proj-sovereign-os",
    name: "Sovereign AI Distributed Operating System",
    requiredPoints: 30000,
    completionPayout: 45000000, // $45M jackpot payout!
    requiredRoleIds: ["dev", "designer", "qa", "lead"],
    description: "Autonomous machine-learning operating kernel designed for planetary satellite mesh networks."
  }
];
