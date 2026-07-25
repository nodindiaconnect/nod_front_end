
  import { lazy, Suspense, useRef } from "react"
  import { Routes, Route, Navigate } from "react-router-dom"

  import PrivateRoute from "./router/PrivateRoute"
  import PublicRoute from "./router/PublicRoute"
  import { isAuthenticated } from "./utils/auth"

  // import FeaturedServices from "./pages/Featuredservices"
  import FeaturedProjects from "./pages/FeatureProjects"
  import Footer from "./pages/Footer"
  import HeroSection from "./pages/HeroSection"
  import Marquee from "./pages/Marquee"
  import Navbar from "./pages/Navbar"
  import OurServices from "./pages/Ourprocess"
  import NewHeritage from "./pages/subsection"
  import WhyChooseUs from "./pages/Whychooseuse"
  import LoginPage from "./Authentication/Login"

  import DashboardLayout from "./components/dashboard/Dashboardlayout"
  import RoleSwitch from "./router/RoleSwitch"
  import Loader from "./global/Loader"
  import CategoryShowcase from "./pages/CategoryShowcase"
  import WorkShowcase from "./pages/scrollingImages"
  import ContactSection from "./pages/contact"
  import About from "./pages/About"
  import ProjectsGallery from "./pages/Designers"
  import FeaturedProducts from "./pages/supplyProducts"
  import ProductDetailsPage from "./pages/produtsdetailsPage"
import LeadPopup from "./pages/LeadPopup"

  // ── Client ──
  const ClientDashboard = lazy(() => import("./components/dashboardPages/client/Dashboard/Dashboard"))
  const ClientProjects = lazy(() => import("./components/dashboardPages/client/ProjectsPage"))
  const ClientFindPros = lazy(() => import("./components/dashboardPages/client/FindProsPage"))
  const ClientPayments = lazy(() => import("./components/dashboardPages/client/PaymentsPage"))
  const ClientSettings = lazy(() => import("./components/dashboardPages/client/SettingsPage"))
  const ClientReviews = lazy(() => import("./components/dashboardPages/client/ReviewsPage"))

  // ── Designer ──
  const DesignerOverview = lazy(() => import("./components/dashboardPages/designer/dashboard/DesignerDashboard"))
  const DesignerPortfolio = lazy(() => import("./components/dashboardPages/designer/PortfolioPage"))
  const DesignerProposals = lazy(() => import("./components/dashboardPages/designer/ProposalsPage"))
  const DesignerProjects = lazy(() => import("./components/dashboardPages/designer/ProjectsPage"))
  const DesignerEarnings = lazy(() => import("./components/dashboardPages/designer/EarningsPage"))
  const DesignerSettings = lazy(() => import("./components/dashboardPages/designer/SettingsPage"))
  const DesignerReviews = lazy(() => import("./components/dashboardPages/designer/ReviewsPage"))

  // ── Architect ──
  const ArchitectOverview = lazy(() => import("./components/dashboardPages/architech/dashboard/dashboard"))
  const ArchitectPortfolio = lazy(() => import("./components/dashboardPages/architech/PortfolioPage"))
  const ArchitectProposals = lazy(() => import("./components/dashboardPages/architech/ProposalsPage"))
  const ArchitectProjects = lazy(() => import("./components/dashboardPages/architech/ProjectsPage"))
  const ArchitectEarnings = lazy(() => import("./components/dashboardPages/architech/EarningsPage"))
  const ArchitectSettings = lazy(() => import("./components/dashboardPages/architech/SettingsPage"))
  const ArchitectReviews = lazy(() => import("./components/dashboardPages/architech/ReviewsPage"))

  // ── Contractor ──
  const ContractorOverview = lazy(() => import("./components/dashboardPages/contractor/dashboard/dashbaord"))
  const ContractorPortfolio = lazy(() => import("./components/dashboardPages/architech/PortfolioPage"))
  const ContractorProjects = lazy(() => import("./components/dashboardPages/architech/ProjectsPage"))
  const ContractorProposals = lazy(() => import("./components/dashboardPages/contractor/ProposalsPage"))
  const ContractorEarnings = lazy(() => import("./components/dashboardPages/architech/EarningsPage"))
  const ContractorSettings = lazy(() => import("./components/dashboardPages/architech/SettingsPage"))
  const ContractorReviews = lazy(() => import("./components/dashboardPages/architech/ReviewsPage"))


  // ── Material Supplier ──
  const SupplierOverview = lazy(() => import("./components/dashboardPages/materialSupplier/dashboard/materialSupplierdashboard"))
  const SupplierProducts = lazy(() => import("./components/dashboardPages/materialSupplier/Products"))
  const SupplierCreateProduct = lazy(() => import("./components/dashboardPages/materialSupplier/addProduct"))

  // ── Shared ──
  const MessagesPage = lazy(() => import("./components/dashboard/shared/MessagesPage"))
  // const NotFound = lazy(() => import("./pages/NotFound"))

  // ── Role → component maps (per route key) ──
  // ── Role → component maps (per route key) ──


  const PAGE_MAP = {
    overview: { 1: ClientDashboard, 2: DesignerOverview, 3: ArchitectOverview, 4: ContractorOverview, 5: SupplierOverview },
    projects: { 1: ClientProjects, 2: DesignerProjects, 3: ArchitectProjects, 4: ContractorProjects },
    products: { 5: SupplierProducts },
    createProduct: { 5: SupplierCreateProduct },
    messages: { 1: MessagesPage, 2: MessagesPage, 3: MessagesPage, 4: MessagesPage, 5: MessagesPage },
    settings: { 1: ClientSettings, 2: DesignerSettings, 3: ArchitectSettings, 4: ContractorSettings },
    find: { 1: ClientFindPros },
    payments: { 1: ClientPayments },
    portfolio: { 2: DesignerPortfolio, 3: ArchitectPortfolio, 4: ContractorPortfolio },
    proposals: { 2: DesignerProposals, 3: ArchitectProposals, 4: ContractorProposals },
    browseProjects: { 2: DesignerProposals, 3: ArchitectProposals, 4: ContractorProposals },
    earnings: { 2: DesignerEarnings, 3: ArchitectEarnings, 4: ContractorEarnings },
    reviews: { 1: ClientReviews, 2: DesignerReviews, 3: ArchitectReviews, 4: ContractorReviews },
  }



  function Home() {
    const panelRef = useRef(null)

    return (
      <>
            <LeadPopup/>

        <div className="relative w-full h-screen">
          <Navbar />
          <HeroSection panelRef={panelRef} />
        </div>

        <div
          ref={panelRef}
          className="relative z-10 rounded-t-[2rem] "
        >
          <CategoryShowcase />

          <Marquee />
          {/* <FeaturedServices /> */}
          <WorkShowcase />
          <FeaturedProjects />
          <NewHeritage />
          <WhyChooseUs />
          <OurServices />
          {/* <FeaturedProducts /> */}
          <ContactSection />
          <Footer />
        </div>
      </>
    )
  }

  function App() {
    return (
      <Suspense fallback={<div className="p-10 text-center text-sm">
        <Loader />
      </div>}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Home />}
          />
          <Route path="/About" element={<About />} />
          <Route path="/designs" element={<ProjectsGallery />} />
          <Route path="/supplier-products" element={<FeaturedProducts />} />


          <Route element={<PublicRoute restricted />}>
            <Route path="/Signin" element={<LoginPage />} />
            <Route path="/products/:productId" element={<ProductDetailsPage />} />

          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<RoleSwitch map={PAGE_MAP.overview} />} />
              <Route path="projects" element={<RoleSwitch map={PAGE_MAP.projects} />} />
              <Route path="messages" element={<RoleSwitch map={PAGE_MAP.messages} />} />
              <Route path="settings" element={<RoleSwitch map={PAGE_MAP.settings} />} />
              <Route path="payments" element={<RoleSwitch map={PAGE_MAP.payments} />} />
              <Route path="find" element={<RoleSwitch map={PAGE_MAP.find} />} />
              <Route path="portfolio" element={<RoleSwitch map={PAGE_MAP.portfolio} />} />
              <Route path="browse-projects" element={<RoleSwitch map={PAGE_MAP.browseProjects} />} />
              <Route path="products" element={<RoleSwitch map={PAGE_MAP.products} />} />
              <Route path="products/create" element={<RoleSwitch map={PAGE_MAP.createProduct} />} />
              <Route path="proposals" element={<RoleSwitch map={PAGE_MAP.proposals} />} />
              <Route path="earnings" element={<RoleSwitch map={PAGE_MAP.earnings} />} />
              <Route path="reviews" element={<RoleSwitch map={PAGE_MAP.reviews} />} />
            </Route>
          </Route>

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Suspense>
    )
  }

  export default App