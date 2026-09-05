import { lazy, Suspense, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";
import { isAuthenticated } from "./utils/auth";

import FeaturedProjects from "./pages/FeatureProjects";
import Footer from "./pages/Footer";
import HeroSection from "./pages/HeroSection";
import Navbar from "./pages/Navbar";
import OurServices from "./pages/Ourprocess";
import NewHeritage from "./pages/subsection";
import WhyChoose from "./pages/WhyChooseUs";

import AuthPage from "./Authentication/Authpage";

import DashboardLayout from "./components/dashboard/Dashboardlayout";
import RoleSwitch from "./router/RoleSwitch";
import Loader from "./global/Loader";
import CategoryShowcase from "./pages/CategoryShowcase";
import WorkShowcase from "./pages/scrollingImages";
import ContactSection from "./pages/contact";
import About from "./pages/About";
import ProjectsGallery from "./pages/Designers";
import FeaturedProducts from "./pages/supplyProducts";
import ProductDetailsPage from "./pages/produtsdetailsPage";
import LeadPopup from "./pages/LeadPopup";
import AllPortfolios from "./pages/AllPortfolios";
import UserPortfolioProfile from "./pages/UserPortfolioProfile";
import PortfolioProjectDetails from "./pages/PortfolioProjectDetails";
import PortfoliosByRolePage from "./pages/explore";
import FrozenMusicSection from "./components/FrozenMusicSection";
import ThreeDSpaceVisualizer from "./components/ThreeDSpaceVisualizer";

// ── Client ──
const ClientDashboard = lazy(
  () => import("./components/dashboardPages/client/Dashboard/Dashboard"),
);
const ClientProjects = lazy(
  () => import("./components/dashboardPages/client/ProjectsPage"),
);
const ClientFindPros = lazy(
  () => import("./components/dashboardPages/client/FindProsPage"),
);
const ClientPayments = lazy(
  () => import("./components/dashboardPages/client/PaymentsPage"),
);
const ClientSettings = lazy(
  () => import("./components/dashboardPages/client/SettingsPage"),
);
const ClientReviews = lazy(
  () => import("./components/dashboardPages/client/ReviewsPage"),
);
const ClientProfile = lazy(
  () => import("./components/dashboardPages/client/ProfilePage"),
);

// ── Designer ──
const DesignerOverview = lazy(
  () =>
    import("./components/dashboardPages/designer/dashboard/DesignerDashboard"),
);
const DesignerPortfolio = lazy(
  () => import("./components/dashboardPages/designer/PortfolioPage"),
);
const DesignerProposals = lazy(
  () => import("./components/dashboardPages/designer/ProposalsPage"),
);
const DesignerProjects = lazy(
  () => import("./components/dashboardPages/designer/ProjectsPage"),
);
const DesignerEarnings = lazy(
  () => import("./components/dashboardPages/designer/EarningsPage"),
);
const DesignerSettings = lazy(
  () => import("./components/dashboardPages/designer/SettingsPage"),
);
const DesignerReviews = lazy(
  () => import("./components/dashboardPages/designer/ReviewsPage"),
);
const DesignerPosts = lazy(
  () => import("./components/dashboardPages/designer/createPost"),
);
const DesignerProfile = lazy(
  () => import("./components/dashboardPages/designer/ProfilePage"),
);

// ── Architect ──
const ArchitectOverview = lazy(
  () => import("./components/dashboardPages/architech/dashboard/dashboard"),
);
const ArchitectPortfolio = lazy(
  () => import("./components/dashboardPages/architech/PortfolioPage"),
);
const ArchitectProposals = lazy(
  () => import("./components/dashboardPages/architech/ProposalsPage"),
);
const ArchitectProjects = lazy(
  () => import("./components/dashboardPages/architech/ProjectsPage"),
);
const ArchitectEarnings = lazy(
  () => import("./components/dashboardPages/architech/EarningsPage"),
);
const ArchitectSettings = lazy(
  () => import("./components/dashboardPages/architech/SettingsPage"),
);
const ArchitectReviews = lazy(
  () => import("./components/dashboardPages/architech/ReviewsPage"),
);
const ArchitectProfile = lazy(
  () => import("./components/dashboardPages/architech/ProfilePage"),
);

// ── Contractor ──
const ContractorOverview = lazy(
  () => import("./components/dashboardPages/contractor/dashboard/dashbaord"),
);
const ContractorPortfolio = lazy(
  () => import("./components/dashboardPages/contractor/PortfolioPage"),
);
const ContractorProjects = lazy(
  () => import("./components/dashboardPages/contractor/ProjectsPage"),
);
const ContractorProposals = lazy(
  () => import("./components/dashboardPages/contractor/ProposalsPage"),
);
const ContractorEarnings = lazy(
  () => import("./components/dashboardPages/contractor/EarningsPage"),
);
const ContractorSettings = lazy(
  () => import("./components/dashboardPages/contractor/SettingsPage"),
);
const ContractorReviews = lazy(
  () => import("./components/dashboardPages/contractor/ReviewsPage"),
);
const ContractorProfile = lazy(
  () => import("./components/dashboardPages/contractor/ProfilePage"),
);

// ── Material Supplier ──
const SupplierOverview = lazy(
  () =>
    import("./components/dashboardPages/materialSupplier/dashboard/materialSupplierdashboard"),
);
const SupplierProducts = lazy(
  () => import("./components/dashboardPages/materialSupplier/Products"),
);
const SupplierCreateProduct = lazy(
  () => import("./components/dashboardPages/materialSupplier/addProduct"),
);
const SupplierProfile = lazy(
  () => import("./components/dashboardPages/materialSupplier/ProfilePage"),
);

// ── Shared ──
const MessagesPage = lazy(
  () => import("./components/dashboard/shared/MessagesPage"),
);

const PAGE_MAP = {
  overview: {
    Client: ClientDashboard,
    Designer: DesignerOverview,
    Architect: ArchitectOverview,
    Contractor: ContractorOverview,
    MaterialSupplier: SupplierOverview,
  },
  projects: {
    Client: ClientProjects,
    Designer: DesignerProjects,
    Architect: ArchitectProjects,
    Contractor: ContractorProjects,
  },
  posts: {
    Designer: DesignerPortfolio,
    Architect: ArchitectPortfolio,
    Contractor: ContractorPortfolio,
  },
  products: { MaterialSupplier: SupplierProducts },
  createProduct: { MaterialSupplier: SupplierCreateProduct },
  messages: {
    Client: MessagesPage,
    Designer: MessagesPage,
    Architect: MessagesPage,
    Contractor: MessagesPage,
    MaterialSupplier: MessagesPage,
  },
  settings: {
    Client: ClientSettings,
    Designer: DesignerSettings,
    Architect: ArchitectSettings,
    Contractor: ContractorSettings,
    MaterialSupplier: ClientSettings,
  },
  find: { Client: ClientFindPros },
  payments: { Client: ClientPayments },
  profile: {
    Client: ClientProfile,
    Designer: DesignerProfile,
    Architect: ArchitectProfile,
    Contractor: ContractorProfile,
    MaterialSupplier: SupplierProfile,
  },
  portfolio: {
    Designer: DesignerPortfolio,
    Architect: ArchitectPortfolio,
    Contractor: ContractorPortfolio,
  },
  proposals: {
    Designer: DesignerProposals,
    Architect: ArchitectProposals,
    Contractor: ContractorProposals,
  },
  browseProjects: {
    Designer: DesignerProposals,
    Architect: ArchitectProposals,
    Contractor: ContractorProposals,
  },
  earnings: {
    Designer: DesignerEarnings,
    Architect: ArchitectEarnings,
    Contractor: ContractorEarnings,
  },
  reviews: {
    Client: ClientReviews,
    Designer: DesignerReviews,
    Architect: ArchitectReviews,
    Contractor: ContractorReviews,
  },
};

function Home() {
  const panelRef = useRef(null);

  return (
    <>
      <LeadPopup />

      {/* Fixed "Explore" tag - right side, vertically centered, stays fixed on scroll */}
      <a
        href="/explore"
        className="hidden lg:flex fixed top-1/2 right-0 -translate-y-1/2 z-50 items-center px-4 py-3 bg-[var(--gold)] text-black text-xs font-semibold tracking-wide rounded-l-lg shadow-lg hover:pr-6 transition-all duration-200"
        style={{ writingMode: "vertical-rl" }}
      >
        Explore
      </a>

      <div className="relative w-full h-screen">
        <Navbar />
        <HeroSection panelRef={panelRef} />
      </div>
      <div ref={panelRef} className="relative z-10 rounded-t-[2rem]">
        <CategoryShowcase />
        <WorkShowcase />
        <ThreeDSpaceVisualizer />
        <FrozenMusicSection />

        <FeaturedProjects />
        <NewHeritage />
        <OurServices />
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-sm">
          <Loader />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/About" element={<About />} />
        <Route path="/designs" element={<ProjectsGallery />} />
        <Route path="/supplier-products" element={<FeaturedProducts />} />
        <Route path="/contact" element={<ContactSection />} />
        <Route path="/explore" element={<PortfoliosByRolePage />} />
        <Route path="/portfolios" element={<AllPortfolios />} />
        <Route path="/portfolio/:userId" element={<UserPortfolioProfile />} />
        <Route
          path="/portfolio/:userId/project/:projectId"
          element={<PortfolioProjectDetails />}
        />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path="/why-choose" element={<WhyChoose />} />
        <Route element={<PublicRoute restricted />}>
          <Route path="/Signin" element={<AuthPage />} />
          <Route path="/Signup" element={<AuthPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<RoleSwitch map={PAGE_MAP.overview} />} />
            <Route
              path="projects"
              element={<RoleSwitch map={PAGE_MAP.projects} />}
            />
            <Route
              path="messages"
              element={<RoleSwitch map={PAGE_MAP.messages} />}
            />
            <Route
              path="settings"
              element={<RoleSwitch map={PAGE_MAP.settings} />}
            />
            <Route
              path="payments"
              element={<RoleSwitch map={PAGE_MAP.payments} />}
            />
            <Route
              path="myprofile"
              element={<RoleSwitch map={PAGE_MAP.profile} />}
            />
            <Route path="find" element={<RoleSwitch map={PAGE_MAP.find} />} />
            <Route
              path="portfolio"
              element={<RoleSwitch map={PAGE_MAP.portfolio} />}
            />
            <Route
              path="browse-projects"
              element={<RoleSwitch map={PAGE_MAP.browseProjects} />}
            />
            <Route
              path="products"
              element={<RoleSwitch map={PAGE_MAP.products} />}
            />
            <Route
              path="products/create"
              element={<RoleSwitch map={PAGE_MAP.createProduct} />}
            />
            <Route path="posts" element={<RoleSwitch map={PAGE_MAP.posts} />} />
            <Route
              path="proposals"
              element={<RoleSwitch map={PAGE_MAP.proposals} />}
            />
            <Route
              path="earnings"
              element={<RoleSwitch map={PAGE_MAP.earnings} />}
            />
            <Route
              path="reviews"
              element={<RoleSwitch map={PAGE_MAP.reviews} />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
