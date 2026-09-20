import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import logo from "../assets/logo.png"
import LoginBackground from "../assets/LoginBackground.jpg"
import { BG, LINE, SURFACE, INK, WelcomeBackCard } from "./authShared"
import LoginForm from "./LoginForm"
import SignUpForm from "./SignUpForm"

export default function AuthPage() {
  const location = useLocation()
  const [isSignUp, setIsSignUp] = useState(() => 
    location.pathname.toLowerCase().includes("signup")
  )

  useEffect(() => {
    setIsSignUp(location.pathname.toLowerCase().includes("signup"))
  }, [location.pathname])

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: BG,
        backgroundImage: `url(${LoginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      {/* ── HEADER ── */}
      <header
        className="border-b py-4 sm:py-6 px-4 flex items-center justify-center gap-2 sm:gap-3"
        style={{ borderColor: LINE, background: SURFACE }}
      >
        <img src={logo} alt="Night Owl Designers" className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover shrink-0" />
        <h1
          className="text-base sm:text-xl md:text-2xl font-normal text-center tracking-[2px] sm:tracking-[4px] md:tracking-[6px]"
          style={{ fontFamily: "Georgia, serif", color: INK }}
        >
          NIGHT OWL DESIGNERS
        </h1>
      </header>

      <div className="relative flex justify-center items-start mt-6 sm:mt-10 md:mt-14 px-3 sm:px-4 pb-10 md:pb-14">
        {!isSignUp && (
          <div className="hidden lg:block" style={{ marginTop: 44, marginRight: -30, zIndex: 2, position: "relative" }}>
            <WelcomeBackCard />
          </div>
        )}

        {isSignUp ? (
          <SignUpForm onSwitchToLogin={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onSwitchToSignUp={() => setIsSignUp(true)} />
        )}
      </div>

      <div className="text-center my-2 pb-10 px-4 text-sm" style={{ color: INK }}>
        Want to get matched with the perfect designer?{" "}
        <a href="#" className="underline">Take our Style Quiz ›</a>
      </div>
    </div>
  )
}