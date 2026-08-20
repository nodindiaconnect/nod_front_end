import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { useGetUserPortfolioQuery } from "./supplyproductsapislice";
import { findDemoPortfolio, normalisePortfolio } from "./portfolioDemoData";
import "./portfolio.css";

export default function PortfolioProjectDetails() {
  const { userId, projectId } = useParams(); const location = useLocation(); const navigate = useNavigate();
  const { data, isLoading } = useGetUserPortfolioQuery(userId, { skip: userId?.startsWith("demo-") });
  const fallback = findDemoPortfolio(userId); const user = normalisePortfolio(data?.user || location.state?.user || fallback);
  const projects = data?.data?.length ? data.data : (location.state?.projects || user.posts || fallback.posts);
  const project = location.state?.project || projects.find((item) => String(item.id) === String(projectId));
  if (isLoading && !project) return <main className="portfolio-page"><div className="portfolio-shell portfolio-detail-loading">Loading project…</div></main>;
  if (!project) return <main className="portfolio-page"><div className="portfolio-shell portfolio-detail-loading"><p>Project not found.</p><button className="portfolio-link" onClick={() => navigate(`/portfolio/${userId}`)}>Return to portfolio</button></div></main>;
  const images = project.images?.length ? project.images : [];
  return <main className="portfolio-page"><header className="portfolio-header"><div className="portfolio-shell portfolio-header-inner"><button onClick={() => navigate(`/portfolio/${userId}`, { state: { user } })} className="portfolio-icon-button" aria-label="Back to portfolio"><ArrowLeft size={20} /></button><button onClick={() => navigate(`/portfolio/${userId}`, { state: { user } })} className="portfolio-link">Back to portfolio</button></div></header><article className="portfolio-shell portfolio-detail"><div className="portfolio-detail-heading"><p className="portfolio-eyebrow">{user.name} · Project</p><h1>{project.title || "Untitled project"}</h1>{user.city && <p className="portfolio-location"><MapPin size={15} /> {user.city}</p>}</div>{images.length ? <div className="portfolio-detail-images">{images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${project.title || "Project"} ${index + 1}`} />)}</div> : <div className="portfolio-detail-placeholder">{project.title?.[0] || "P"}</div>}<div className="portfolio-detail-description"><h2>About this project</h2><p>{project.description || "Project details will be shared soon."}</p></div></article></main>;
}
