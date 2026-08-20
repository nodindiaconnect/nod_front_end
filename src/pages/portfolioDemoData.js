import livingRoom from "../assets/p1.jpg";
import exterior from "../assets/p2.jpg";
import bedroom from "../assets/p3.jpg";
import studio from "../assets/hero.png";

export const ROLE_LABELS = { 1: "Client", 2: "Interior Designer", 3: "Architect", 4: "Contractor", 5: "Material Supplier" };
const images = [livingRoom, exterior, bedroom, studio];
const makePosts = (owner, offset = 0) => images.map((image, index) => ({ id: `${owner}-post-${index + 1}`, title: ["Warm minimal living", "Courtyard house", "Calm bedroom palette", "Studio details"][index], description: "A considered space shaped around natural light, texture, and everyday living.", images: [image], createdAt: "2026-07-" + String(8 + index + offset).padStart(2, "0") }));
export const demoPortfolios = [
  { id: "demo-anaya", name: "Anaya Mehta", username: "anaya.spaces", role: 2, city: "Mumbai", profile: { bio: "Interior designer creating warm, liveable homes.", specialization: "Residential interiors", photos: [livingRoom] }, _count: { posts: 4, followers: 1280, following: 314 }, posts: makePosts("demo-anaya") },
  { id: "demo-aarav", name: "Aarav Shah", username: "aaravbuilds", role: 3, city: "Ahmedabad", profile: { bio: "Architecture rooted in climate and craft.", specialization: "Architecture", photos: [exterior] }, _count: { posts: 4, followers: 946, following: 201 }, posts: makePosts("demo-aarav", 1) },
  { id: "demo-mira", name: "Mira Kapoor", username: "miramade", role: 2, city: "Bengaluru", profile: { bio: "Thoughtful spaces for modern Indian life.", specialization: "Space styling", photos: [bedroom] }, _count: { posts: 4, followers: 2100, following: 187 }, posts: makePosts("demo-mira", 2) },
  { id: "demo-rohan", name: "Rohan Verma", username: "rohan.contracts", role: 4, city: "New Delhi", profile: { bio: "Reliable execution from structure to finishing.", specialization: "Construction", photos: [studio] }, _count: { posts: 4, followers: 758, following: 126 }, posts: makePosts("demo-rohan", 3) },
];
export const parseProfile = (profile) => { if (!profile) return {}; if (typeof profile === "object") return profile; try { return JSON.parse(profile); } catch { return {}; } };
export const normalisePortfolio = (user) => ({ ...user, profile: parseProfile(user.profile), posts: user.posts || [], _count: user._count || {} });
export const findDemoPortfolio = (id) => demoPortfolios.find((user) => user.id === id) || demoPortfolios[0];
