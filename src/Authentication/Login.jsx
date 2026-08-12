// // import { useState, useEffect, useRef } from "react"
// // import logo from "../assets/logo.png"
// // import { Country } from "country-state-city"
// // import {
// //   useRegisterMutation,
// //   useVerifyMutation,
// //   useLoginMutation,
// //   useForgotMutation,
// //   useVerifyOtpMutation,
// //   useChangePwdMutation,
// //   useOTPresentMutation,
// //   useLazyCheckUsernameQuery,
// // } from "../Authentication/authApiSlice"
// // import { Check } from "lucide-react";
// // import { useNavigate } from "react-router-dom"
// // import Cookies from "js-cookie"
// // import { useToast } from "../utils/toast"
// // import "../theme.css";
// // const root = getComputedStyle(document.documentElement);
// // import LoginBackground from "../assets/LoginBackground.jpg"
// // const INK = root.getPropertyValue("--heading").trim();
// // const INK_SOFT = root.getPropertyValue("--text").trim();
// // const GOLD = root.getPropertyValue("--gold").trim();
// // const GOLD_DARK = root.getPropertyValue("--gold-hover").trim();
// // const LINE = root.getPropertyValue("--border").trim();
// // const BG = root.getPropertyValue("--background").trim();

// // const PRIMARY = root.getPropertyValue("--primary").trim();
// // const PRIMARY_HOVER = root.getPropertyValue("--primary-hover").trim();
// // const SURFACE = root.getPropertyValue("--surface").trim();

// // const ERROR_BG = "#fdecea"; // You can create a CSS variable if needed
// // const ERROR_TEXT = root.getPropertyValue("--danger").trim();
// // const OK_TEXT = root.getPropertyValue("--success").trim();


// // const ROLE_CODES = {
// //   Client: 1,
// //   Designer: 2,
// //   Architect: 3,
// //   Contractor: 4,
// //   MaterialSupplier: 5,

// // }

// // const ROLE_LABELS = {
// //   Client: "Client",
// //   Designer: "Designer",
// //   Architect: "Architect",
// //   Contractor: "Contractor",
// //   MaterialSupplier: "Material Supplier",
// // }

// // const ROLE_FIELDS = {
// //   Client: { heading: "Almost There", subtitle: "Confirm your location and preferences.", fields: [] },
// //   Designer: {
// //     heading: "Set Up Your Designer Profile",
// //     subtitle: "Showcase your style and attract the right clients.",
// //     fields: [
// //       { id: "bio", label: "Short Bio", type: "textarea", placeholder: "Tell clients about your design philosophy..." },
// //       { id: "specialization", label: "Specialization", type: "select", options: ["Interior Designer", "Exterior Designer", "AutoCAD Designer", "BIM designer", "vastu consultant", "product designer", "Structural Designer", "Landscape Designer", "3D Visualizer"] },
// //       { id: "style", label: "Signature Style", type: "select", options: ["Modern", "Minimalist", "Luxury", "Scandinavian", "Industrial", "Eclectic"] },
// //       { id: "experience", label: "Years of Experience", type: "number", placeholder: "e.g. 5" },
// //       { id: "rate", label: "Hourly Rate (Optional)", type: "number", placeholder: "e.g. 80" },
// //     ],
// //   },
// //   Architect: {
// //     heading: "Set Up Your Architect Profile",
// //     subtitle: "Highlight your expertise and win more projects.",
// //     fields: [
// //       { id: "bio", label: "Short Bio", type: "textarea", placeholder: "Describe your architectural approach..." },
// //       // { id: "license", label: "(COA) License Number", type: "text", placeholder: "e.g. AR-123456" },
// //       { id: "specialization", label: "Project Type", type: "select", options: ["Residential", "Commercial", "Mixed-Use", "Industrial", "Urban Planning"] },
// //       { id: "software", label: "Primary Software", type: "select", options: ["AutoCAD", "Revit", "ArchiCAD", "SketchUp", "Rhino"] },
// //       { id: "experience", label: "Years of Experience", type: "number", placeholder: "e.g. 10" },
// //     ],
// //   },
// //   Contractor: {
// //     heading: "Set Up Your Contractor Profile",
// //     subtitle: "Show clients what you can build.",
// //     fields: [
// //       { id: "bio", label: "Company / Personal Bio", type: "textarea", placeholder: "Describe your contracting services..." },
// //       { id: "trade", label: "Primary Trade", type: "select", options: ["General Contractor", "Electrical", "Plumbing", "Carpentry", "Masonry", "Painting", "HVAC"] },
// //       // { id: "gstin", label: "GSTIN Number", type: "text", placeholder: "e.g. 22AAAAA0000A1Z5" },
// //       { id: "experience", label: "Years of Experience", type: "number", placeholder: "e.g. 8" },
// //     ],
// //   },

// //   MaterialSupplier: {
// //     heading: "Set Up Your Supplier Profile",
// //     subtitle: "List your materials and reach more builders and designers.",
// //     fields: [
// //       { id: "businessName", label: "Business Name", type: "text", placeholder: "e.g. Sharma Building Materials" },
// //       { id: "ownerName", label: "Owner Name", type: "text", placeholder: "e.g. Ramesh Sharma" },
// //       { id: "businessType", label: "Business Type", type: "select", options: ["Manufacturer", "Wholesaler", "Retailer", "Distributor", "Importer"] },
// //     ],
// //   },


// // }

// // // Every role walks through Account -> Location -> (Profile, if it has fields) -> Review.
// // // Client = 3 steps. Designer / Architect / Contractor = 4 steps.
// // const STEP_META = {
// //   account: { label: "Account" },
// //   location: { label: "Location" },
// //   profile: { label: "Profile" },
// //   review: { label: "Review" },
// // }

// // function getStepsForRole(role) {
// //   if (!role) return ["account"]
// //   const hasProfileFields = (ROLE_FIELDS[role]?.fields || []).length > 0
// //   return hasProfileFields ? ["account", "location", "profile", "review"] : ["account", "location", "review"]
// // }

// // /* ────────────────────────────────────────────────────────────────
// //    SMALL REUSABLE PIECES (styled like HavenlyAuth)
// // ──────────────────────────────────────────────────────────────── */

// // function FieldLabel({ children }) {
// //   return (
// //     <div className="text-[10px] font-semibold mb-2" style={{ color: INK, letterSpacing: "1.5px" }}>
// //       {children}
// //     </div>
// //   )
// // }

// // function TextInput({ label, disabled, className = "", ...props }) {
// //   return (
// //     <div className="mb-4">
// //       {label && <FieldLabel>{label}</FieldLabel>}
// //       <input
// //         {...props}
// //         disabled={disabled}
// //         className={`w-full px-4 py-3.5 text-sm outline-none transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
// //         style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
// //       />
// //     </div>
// //   )
// // }

// // function SelectInput({ label, disabled, children, ...props }) {
// //   return (
// //     <div className="mb-4">
// //       {label && <FieldLabel>{label}</FieldLabel>}
// //       <select
// //         {...props}
// //         disabled={disabled}
// //         className={`w-full px-4 py-3.5 text-sm outline-none appearance-none ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
// //         style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
// //       >
// //         {children}
// //       </select>
// //     </div>
// //   )
// // }

// // function TextAreaInput({ label, disabled, ...props }) {
// //   return (
// //     <div className="mb-4">
// //       {label && <FieldLabel>{label}</FieldLabel>}
// //       <textarea
// //         {...props}
// //         disabled={disabled}
// //         className={`w-full px-4 py-3.5 text-sm outline-none resize-none ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
// //         style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
// //       />
// //     </div>
// //   )
// // }

// // function PrimaryButton({ children, className = "", ...props }) {
// //   return (
// //     <button
// //       {...props}
// //       className={`w-full py-4 text-white text-sm tracking-wide disabled:opacity-50 transition-colors duration-300 ${className}`}
// //       style={{ background: PRIMARY }}
// //       onMouseEnter={(e) => !props.disabled && (e.currentTarget.style.background = PRIMARY_HOVER)}
// //       onMouseLeave={(e) => !props.disabled && (e.currentTarget.style.background = PRIMARY)}
// //     >
// //       {children}
// //     </button>
// //   )
// // }

// // function GhostButton({ children, className = "", ...props }) {
// //   return (
// //     <button
// //       {...props}
// //       className={`w-full py-4 text-sm tracking-wide border disabled:opacity-40 ${className}`}
// //       style={{ borderColor: INK_SOFT, color: INK }}
// //     >
// //       {children}
// //     </button>
// //   )
// // }

// // // Progress dots for the signup wizard — order carries real meaning here
// // // (you can't fill in profile details before you have an account), so a
// // // numbered sequence is the right structural device.
// // function StepProgress({ stepKeys, currentKey }) {
// //   const currentIndex = stepKeys.indexOf(currentKey)
// //   return (
// //     <div className="flex items-center mb-8">
// //       {stepKeys.map((key, i) => {
// //         const done = i < currentIndex
// //         const active = i === currentIndex
// //         return (
// //           <div key={key} className="flex items-center" style={{ flex: i === stepKeys.length - 1 ? "0 0 auto" : 1 }}>
// //             <div className="flex flex-col items-center" style={{ minWidth: 64 }}>
// //               <div
// //                 className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] shrink-0"
// //                 style={{
// //                   border: `1px solid ${done || active ? GOLD : LINE}`,
// //                   background: done ? GOLD : "transparent",
// //                   color: done ? "#fff" : active ? GOLD : INK_SOFT,
// //                   fontWeight: 600,
// //                 }}
// //               >
// //                 {done ? "✓" : i + 1}
// //               </div>
// //               <div
// //                 className="mt-1.5 text-[10px] text-center"
// //                 style={{ color: active ? GOLD : INK_SOFT, fontWeight: active ? 600 : 400, letterSpacing: "0.5px" }}
// //               >
// //                 {STEP_META[key].label}
// //               </div>
// //             </div>
// //             {i !== stepKeys.length - 1 && (
// //               <div className="h-px flex-1 mx-1" style={{ background: done ? GOLD : LINE, marginBottom: 18 }} />
// //             )}
// //           </div>
// //         )
// //       })}
// //     </div>
// //   )
// // }

// // // Left-hand companion card shown only on the Sign In side (mirrors the
// // // StepsCard from HavenlyAuth, but its content — quick things you can do
// // // once you're in — actually fits a returning user).
// // function WelcomeBackCard() {
// //   const highlights = [
// //     "Message your designer directly",
// //     "Track proposals & invoices",
// //     "See your project timeline",
// //   ]
// //   return (
// //     <div className="w-72 p-8 shrink-0" style={{ background: SURFACE, boxShadow: "0 2px 18px rgba(0,0,0,0.08)" }}>
// //       <div
// //         className="w-36 h-36 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center"
// //         style={{ background: "linear-gradient(160deg,#efe6da,#e2d6c4)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)" }}
// //       >
// //         <svg viewBox="0 0 170 170" className="w-full h-full">
// //           <rect width="170" height="170" fill="#e9dfd0" />
// //           <rect x="20" y="20" width="40" height="30" fill="#d7c4a3" stroke={GOLD} strokeWidth="2" />
// //           <circle cx="95" cy="35" r="16" fill="#b8cfc4" />
// //           <rect x="30" y="80" width="90" height="55" fill="#f6f2ea" />
// //           <circle cx="120" cy="70" r="24" fill="#e0c9a6" />
// //           <rect x="107" y="94" width="26" height="40" fill={PRIMARY} />
// //         </svg>
// //       </div>

// //       <div className="text-center mb-6">
// //         <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1.5px" }}>
// //           WELCOME BACK
// //         </div>
// //         <div className="w-9 h-0.5 mx-auto" style={{ background: GOLD }} />
// //       </div>

// //       <div className="flex flex-col gap-5">
// //         {highlights.map((h, i) => (
// //           <div
// //             key={i}
// //             className="flex items-center gap-3 text-sm leading-tight"
// //             style={{ color: INK_SOFT }}
// //           >
// //             <div
// //               className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
// //               style={{ background: GOLD }}
// //             >
// //               <Check size={14} color="white" strokeWidth={3} />
// //             </div>
// //             {h}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   )
// // }

// // /* ────────────────────────────────────────────────────────────────
// //    MAIN COMPONENT
// // ──────────────────────────────────────────────────────────────── */




// // export default function LoginPage() {
// //   const navigate = useNavigate()

// //   const [isSignUp, setIsSignUp] = useState(false)
// //   const [step, setStep] = useState(1) // 1-indexed position within the current role's wizard
// //   const [role, setRole] = useState("")
// //   const [showPassword, setShowPassword] = useState(false)
// //   const [phoneCode, setPhoneCode] = useState("+91")
// //   const [country, setCountry] = useState("")
// //   const [roleFields, setRoleFields] = useState({})
// //   const [showForgotModal, setShowForgotModal] = useState(false)
// //   const [showTermsModal, setShowTermsModal] = useState(false)
// //   const [hasReadTerms, setHasReadTerms] = useState(false)
// //   const [errorMsg, setErrorMsg] = useState("")
// //   const [newPassword, setNewPassword] = useState("")
// //   const [confirmPassword, setConfirmPassword] = useState("")

// //   const [loginEmail, setLoginEmail] = useState("")
// //   const [loginPassword, setLoginPassword] = useState("")
// //   const toast = useToast()

// //   const [fullName, setFullName] = useState("")
// //   const [username, setUsername] = useState("")
// //   const [phone, setPhone] = useState("")
// //   const [signupEmail, setSignupEmail] = useState("")
// //   const [signupPassword, setSignupPassword] = useState("")
// //   const [agreedTerms, setAgreedTerms] = useState(false)

// //   const [showOtpBox, setShowOtpBox] = useState(false)
// //   const [otpValue, setOtpValue] = useState("")
// //   const [emailVerified, setEmailVerified] = useState(false)

// //   const [stateName, setStateName] = useState("")
// //   const [cityName, setCityName] = useState("")
// //   const [addressLine, setAddressLine] = useState("")
// //   const [locatingUser, setLocatingUser] = useState(false)

// //   const [forgotEmail, setForgotEmail] = useState("")
// //   const [forgotStep, setForgotStep] = useState("email")
// //   const [forgotOtp, setForgotOtp] = useState("")

// //   const [usernameStatus, setUsernameStatus] = useState("idle")
// //   const [usernameMessage, setUsernameMessage] = useState("")
// //   const usernameDebounceRef = useRef(null)
// //   const termsBodyRef = useRef(null)

// //   const [countryQuery, setCountryQuery] = useState("")
// //   const [countryOpen, setCountryOpen] = useState(false)
// //   const countryBoxRef = useRef(null)
// //   const allCountries = useRef(Country.getAllCountries()).current


// //   const [phoneCodeQuery, setPhoneCodeQuery] = useState("")
// //   const [phoneCodeOpen, setPhoneCodeOpen] = useState(false)
// //   const phoneCodeBoxRef = useRef(null)


// //   const phoneCodeOptions = useRef(
// //     Array.from(
// //       new Map(
// //         allCountries
// //           .filter((c) => c.phonecode)
// //           .map((c) => {
// //             const code = c.phonecode.startsWith("+") ? c.phonecode : `+${c.phonecode}`
// //             return [code, { code, flag: c.flag, name: c.name }]
// //           })
// //       ).values()
// //     ).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
// //   ).current

// //   const filteredCountries = countryQuery.trim()
// //     ? allCountries.filter((c) => c.name.toLowerCase().includes(countryQuery.trim().toLowerCase()))
// //     : allCountries

// //   console.log(allCountries[0], "controies")
// //   useEffect(() => {
// //     const handleClick = (e) => {
// //       if (countryBoxRef.current && !countryBoxRef.current.contains(e.target)) {
// //         setCountryOpen(false)
// //       }
// //     }
// //     document.addEventListener("mousedown", handleClick)
// //     return () => document.removeEventListener("mousedown", handleClick)
// //   }, [])

// //   useEffect(() => {
// //     const handleClick = (e) => {
// //       if (countryBoxRef.current && !countryBoxRef.current.contains(e.target)) {
// //         setCountryOpen(false)
// //       }
// //       if (phoneCodeBoxRef.current && !phoneCodeBoxRef.current.contains(e.target)) {
// //         setPhoneCodeOpen(false)
// //       }
// //     }
// //     document.addEventListener("mousedown", handleClick)
// //     return () => document.removeEventListener("mousedown", handleClick)
// //   }, [])


// //   const filteredPhoneCodes = phoneCodeQuery.trim()
// //     ? phoneCodeOptions.filter(
// //       (cc) =>
// //         cc.code.includes(phoneCodeQuery.trim()) ||
// //         cc.name.toLowerCase().includes(phoneCodeQuery.trim().toLowerCase())
// //     )
// //     : phoneCodeOptions

// //   const [register, { isLoading: registering }] = useRegisterMutation()
// //   const [verify, { isLoading: verifying }] = useVerifyMutation()
// //   const [login, { isLoading: loggingIn }] = useLoginMutation()
// //   const [forgot, { isLoading: sendingForgotOtp }] = useForgotMutation()
// //   const [verifyOtp, { isLoading: verifyingForgotOtp }] = useVerifyOtpMutation()
// //   const [changePwd] = useChangePwdMutation()
// //   const [resendOtp, { isLoading: resending }] = useOTPresentMutation()
// //   const [triggerCheckUsername] = useLazyCheckUsernameQuery()

// //   const roleConfig = role ? ROLE_FIELDS[role] : null
// //   const fieldsLocked = !role

// //   // ── Wizard bookkeeping ──
// //   const stepKeys = getStepsForRole(role)
// //   const currentIndex = Math.min(step, stepKeys.length) - 1
// //   const currentStepKey = stepKeys[currentIndex] || "account"
// //   const isFirstStep = currentIndex === 0
// //   const isLastStep = currentIndex === stepKeys.length - 1

// //   const setRoleField = (id, value) => setRoleFields((prev) => ({ ...prev, [id]: value }))

// //   const handleTermsScroll = (e) => {
// //     const { scrollTop, scrollHeight, clientHeight } = e.target
// //     if (scrollTop + clientHeight >= scrollHeight - 8) setHasReadTerms(true)
// //   }

// //   useEffect(() => {
// //     if (!showTermsModal || !termsBodyRef.current) return
// //     const el = termsBodyRef.current
// //     if (el.scrollHeight <= el.clientHeight + 8) setHasReadTerms(true)
// //   }, [showTermsModal])

// //   const getErrMsg = (err) => err?.data?.message || err?.error || "Something went wrong. Please try again."

// //   const handleSignIn = async () => {
// //     setErrorMsg("")
// //     try {
// //       const res = await login({ email: loginEmail.toLowerCase(), password: loginPassword }).unwrap()
// //       Cookies.set("token", res.data.token, { expires: 7 })
// //       localStorage.setItem("userData", JSON.stringify(res.data))
// //       toast.success("Signed in successfully")
// //       navigate("/dashboard")
// //     } catch (err) {
// //       setErrorMsg(getErrMsg(err))
// //     }
// //   }

// //   useEffect(() => {
// //     if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current)
// //     const trimmed = username.trim()
// //     if (!trimmed || trimmed.length < 3) {
// //       setUsernameStatus("idle")
// //       return
// //     }
// //     setUsernameStatus("checking")
// //     setUsernameMessage("")
// //     usernameDebounceRef.current = setTimeout(async () => {
// //       try {
// //         const res = await triggerCheckUsername(trimmed).unwrap()
// //         setUsernameStatus(res?.available ? "available" : "taken")
// //         setUsernameMessage(res?.message || "")
// //       } catch (err) {
// //         setUsernameStatus("error")
// //         setUsernameMessage(err?.data?.message || "")
// //       }
// //     }, 500)
// //     return () => clearTimeout(usernameDebounceRef.current)
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [username])

// //   const handleSendOtp = async () => {
// //     setErrorMsg("")
// //     if (!role) return setErrorMsg("Please select a role")
// //     if (!signupEmail) return setErrorMsg("Enter your email first")
// //     if (usernameStatus === "taken") return setErrorMsg(usernameMessage || "That username is already taken. Please choose another.")
// //     try {
// //       await register({
// //         name: fullName,
// //         username,
// //         countryCode: phoneCode,
// //         phone,
// //         email: signupEmail.toLowerCase(),
// //         password: signupPassword,
// //         role: ROLE_CODES[role],
// //       }).unwrap()
// //       setShowOtpBox(true)
// //       toast.success("OTP sent to your email")
// //     } catch (err) {
// //       setErrorMsg(getErrMsg(err))
// //     }
// //   }

// //   const handleResendOtp = async () => {
// //     setErrorMsg("")
// //     try {
// //       await resendOtp({ email: signupEmail.toLowerCase(), otpType: "register" }).unwrap()
// //       toast.success("OTP resent")
// //     } catch (err) {
// //       setErrorMsg(getErrMsg(err))
// //     }
// //   }

// //   const handleUseCurrentLocation = () => {
// //     setErrorMsg("")
// //     if (!navigator.geolocation) return setErrorMsg("Geolocation is not supported by your browser")
// //     setLocatingUser(true)
// //     navigator.geolocation.getCurrentPosition(
// //       async (position) => {
// //         const { latitude, longitude } = position.coords
// //         try {
// //           const res = await fetch(
// //             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
// //             { headers: { "Accept-Language": "en" } }
// //           )
// //           const data = await res.json()
// //           const addr = data.address || {}
// //           setCountry(addr.country || "")
// //           setStateName(addr.state || "")
// //           setCityName(addr.city || addr.town || addr.village || "")
// //           setAddressLine(data.display_name || "")
// //         } catch {
// //           setErrorMsg("Could not resolve address from location")
// //         } finally {
// //           setLocatingUser(false)
// //         }
// //       },
// //       () => {
// //         setLocatingUser(false)
// //         setErrorMsg("Location permission denied or unavailable")
// //       }
// //     )
// //   }

// //   const handleCreateAccount = async () => {
// //     setErrorMsg("")
// //     try {
// //       const res = await verify({
// //         email: signupEmail.toLowerCase(),
// //         otp: otpValue,
// //         otpType: "register",
// //         country,
// //         state: stateName,
// //         city: cityName,
// //         address: addressLine,
// //         roleFields,
// //       }).unwrap()
// //       setEmailVerified(true)
// //       Cookies.set("token", res.data.token, { expires: 7 })
// //       localStorage.setItem("userData", JSON.stringify(res.data))
// //       navigate("/dashboard")
// //     } catch (err) {
// //       setErrorMsg(getErrMsg(err))
// //     }
// //   }

// //   const handleForgotSendOtp = async () => {
// //     setErrorMsg("")
// //     try {
// //       await forgot({ email: forgotEmail.toLowerCase() }).unwrap()
// //       setForgotStep("otp")
// //       toast.success("OTP sent")
// //     } catch (err) {
// //       setErrorMsg(getErrMsg(err))
// //     }
// //   }

// //   const handleForgotVerifyOtp = async () => {
// //     setErrorMsg("")
// //     if (!forgotOtp) return setErrorMsg("Please enter the OTP")
// //     if (!newPassword || !confirmPassword) return setErrorMsg("Please enter and confirm your new password")
// //     if (newPassword !== confirmPassword) return setErrorMsg("Passwords do not match")
// //     try {
// //       await verifyOtp({ email: forgotEmail.toLowerCase(), otp: forgotOtp, otpType: "forgotPassword", newPassword }).unwrap()
// //       setShowForgotModal(false)
// //       setForgotStep("email")
// //       setForgotEmail("")
// //       setForgotOtp("")
// //       setNewPassword("")
// //       setConfirmPassword("")
// //       toast.success("Password reset successfully")
// //     } catch (err) {
// //       setErrorMsg(getErrMsg(err))
// //     }
// //   }

// //   const handleAgreeTerms = () => {
// //     setAgreedTerms(true)
// //     setShowTermsModal(false)
// //   }

// //   // ── Per-step validation for the signup wizard ──
// //   const validateAccountStep = () => {
// //     if (!role) return "Please select a role to continue"
// //     if (usernameStatus === "taken") return usernameMessage || "That username is already taken. Please choose another."
// //     if (!showOtpBox) return "Please send the OTP to your email first"
// //     if (!otpValue) return "Please enter the OTP sent to your email"
// //     if (!agreedTerms) return "Please accept the Terms and Conditions"
// //     return null
// //   }

// //   const validateLocationStep = () => {
// //     if (!country) return "Please select your country"
// //     if (!cityName.trim()) return "Please enter your city"
// //     return null
// //   }

// //   const handleWizardNext = () => {
// //     setErrorMsg("")
// //     if (currentStepKey === "account") {
// //       const err = validateAccountStep()
// //       if (err) return setErrorMsg(err)
// //     } else if (currentStepKey === "location") {
// //       const err = validateLocationStep()
// //       if (err) return setErrorMsg(err)
// //     }
// //     if (currentStepKey === "review") {
// //       handleCreateAccount()
// //       return
// //     }
// //     setStep((s) => s + 1)
// //   }

// //   const handleWizardBack = () => setStep((s) => Math.max(1, s - 1))

// //   const resetSignupState = () => {
// //     setStep(1)
// //     setRole("")
// //     setRoleFields({})
// //     setErrorMsg("")
// //     setShowOtpBox(false)
// //     setEmailVerified(false)
// //     setUsernameStatus("idle")
// //     setUsernameMessage("")
// //   }

// //   const stepHeading = () => {
// //     if (!isSignUp) return "Sign In to Night Owl Designers"
// //     if (currentStepKey === "account") return "Create Your Account"
// //     if (currentStepKey === "location") return "Where Are You Based?"
// //     if (currentStepKey === "profile") return roleConfig?.heading || "Set Up Your Profile"
// //     return "Review & Confirm"
// //   }

// //   const stepSubtitle = () => {
// //     if (!isSignUp) return "Welcome back — let's get you home."
// //     if (currentStepKey === "account") return "Everyone deserves a beautiful home."
// //     if (currentStepKey === "location") return "This helps us match you with the right people nearby."
// //     if (currentStepKey === "profile") return roleConfig?.subtitle || ""
// //     return "Take a look before you submit — you can still go back and change anything."
// //   }

// //   return (
// //     <div
// //       className="min-h-screen w-full"
// //       style={{
// //         background: BG,
// //         backgroundImage: `url(${LoginBackground})`,
// //         backgroundSize: "cover",
// //         backgroundPosition: "center",
// //         backgroundRepeat: "no-repeat",
// //         backgroundAttachment: "scroll",
// //       }}
// //     >
// //       {/* ── HEADER ── */}
// //       <header
// //         className="border-b py-4 sm:py-6 px-4 flex items-center justify-center gap-2 sm:gap-3"
// //         style={{ borderColor: LINE, background: SURFACE }}
// //       >
// //         <img src={logo} alt="Night Owl Designers" className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover shrink-0" />
// //         <h1
// //           className="text-base sm:text-xl md:text-2xl font-normal text-center tracking-[2px] sm:tracking-[4px] md:tracking-[6px]"
// //           style={{ fontFamily: "Georgia, serif", color: INK }}
// //         >
// //           NIGHT OWL DESIGNERS
// //         </h1>
// //       </header>

// //       <div

// //         className="relative flex justify-center items-start mt-6 sm:mt-10 md:mt-14 px-3 sm:px-4 pb-10 md:pb-14">
// //         {/* Companion card — only on Sign In, and only once there's room for it alongside the form. */}
// //         {!isSignUp && (
// //           <div className="hidden lg:block" style={{ marginTop: 44, marginRight: -30, zIndex: 2, position: "relative" }}>
// //             <WelcomeBackCard />
// //           </div>
// //         )}

// //         <div
// //           className={`w-full max-w-full p-5 sm:p-8 md:p-14 relative ${isSignUp ? "sm:w-[540px] md:w-[640px]" : "sm:w-[440px] md:w-[490px]"}`}
// //           style={{ background: SURFACE, boxShadow: "0 2px 18px rgba(0,0,0,0.08)", zIndex: 1 }}
// //         >
// //           <h2 className="text-2xl sm:text-3xl mb-2" style={{ fontFamily: "Georgia, serif", color: INK }}>
// //             {stepHeading()}
// //           </h2>
// //           <p className="mb-6 sm:mb-7 text-sm sm:text-base" style={{ color: INK_SOFT }}>
// //             {stepSubtitle()}
// //           </p>

// //           {isSignUp && <StepProgress stepKeys={stepKeys} currentKey={currentStepKey} />}

// //           {errorMsg && (
// //             <div className="mb-5 px-4 py-3 text-xs" style={{ background: ERROR_BG, color: ERROR_TEXT }}>
// //               {errorMsg}
// //             </div>
// //           )}

// //           {/* ── SIGN IN ── */}
// //           {!isSignUp && (
// //             <form
// //               autoComplete="on"
// //               onSubmit={(e) => {
// //                 e.preventDefault()
// //                 if (!loggingIn) handleSignIn()
// //               }}
// //             >
// //               <TextInput
// //                 label="EMAIL ADDRESS"
// //                 type="email"
// //                 name="username"
// //                 autoComplete="username"
// //                 value={loginEmail}
// //                 onChange={(e) => setLoginEmail(e.target.value)}
// //               />
// //               <div className="mb-2 relative">
// //                 <FieldLabel>PASSWORD</FieldLabel>
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   name="current-password"
// //                   autoComplete="current-password"
// //                   value={loginPassword}
// //                   onChange={(e) => setLoginPassword(e.target.value)}
// //                   className="w-full px-4 py-3.5 pr-12 text-sm outline-none"
// //                   style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="absolute right-4 top-[38px]"
// //                   style={{ color: INK_SOFT }}
// //                 >
// //                   {showPassword ? "🙈" : "👁️"}
// //                 </button>
// //               </div>
// //               <div className="text-right mb-6">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowForgotModal(true)}
// //                   className="text-xs underline"
// //                   style={{ color: GOLD_DARK }}
// //                 >
// //                   Forgot password?
// //                 </button>
// //               </div>

// //               <PrimaryButton type="submit" disabled={loggingIn}>
// //                 {loggingIn ? "Signing In..." : "Sign In"}
// //               </PrimaryButton>

// //               <div className="flex items-center gap-4 my-7">
// //                 <div className="h-px flex-1" style={{ background: LINE }} />
// //                 <span className="text-[10px] tracking-widest uppercase" style={{ color: INK_SOFT }}>or</span>
// //                 <div className="h-px flex-1" style={{ background: LINE }} />
// //               </div>

// //               <button
// //                 type="button"
// //                 className="w-full flex items-center justify-center gap-2 py-3.5 text-sm border"
// //                 style={{ borderColor: LINE, color: INK }}
// //               >
// //                 <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
// //                   <g>
// //                     <path d="m0 0H512V512H0" fill="#fff" />
// //                     <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
// //                     <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
// //                     <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
// //                     <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
// //                   </g>
// //                 </svg>
// //                 Continue with Google
// //               </button>

// //               <div className="text-center mt-6 text-sm" style={{ color: INK_SOFT }}>
// //                 New to NOD?{" "}
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setIsSignUp(true)
// //                     resetSignupState()
// //                   }}
// //                   className="underline"
// //                   style={{ color: INK }}
// //                 >
// //                   Sign Up
// //                 </button>
// //               </div>
// //             </form>
// //           )}

// //           {/* ── SIGNUP · STEP: ACCOUNT ── */}
// //           {isSignUp && currentStepKey === "account" && (
// //             <div>
// //               <div className="mb-5">
// //                 <FieldLabel>SELECT ROLE</FieldLabel>
// //                 <div className="flex flex-wrap gap-2">
// //                   {/* {["Client", "Designer", "Architect", "Contractor", "Material Supplier"].map((item) => (
// //                     <button
// //                       key={item}
// //                       type="button"
// //                       onClick={() => setRole(item)}
// //                       className="rounded-full px-4 py-2 text-xs transition-all"
// //                       style={
// //                         role === item
// //                           ? { background: GOLD, color: "#fff" }
// //                           : { background: "rgba(201,138,62,0.08)", color: INK_SOFT }
// //                       }
// //                     >
// //                       {item}
// //                     </button>
// //                   ))} */}
// //                   {Object.keys(ROLE_LABELS).map((item) => (
// //                     <button
// //                       key={item}
// //                       type="button"
// //                       onClick={() => setRole(item)}
// //                       className="rounded-full px-4 py-2 text-xs transition-all"
// //                       style={
// //                         role === item
// //                           ? { background: GOLD, color: "#fff" }
// //                           : { background: "rgba(201,138,62,0.08)", color: INK_SOFT }
// //                       }
// //                     >
// //                       {ROLE_LABELS[item]}
// //                     </button>
// //                   ))}
// //                 </div>
// //                 {fieldsLocked && (
// //                   <p className="mt-2 text-[11px]" style={{ color: GOLD_DARK }}>
// //                     Select a role to continue.
// //                   </p>
// //                 )}
// //               </div>

// //               <TextInput label="NAME" placeholder="John Doe" value={fullName} disabled={fieldsLocked} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />

// //               <div className="mb-1">
// //                 <TextInput label="USERNAME" placeholder="johndoe123" value={username} disabled={fieldsLocked} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
// //                 {!fieldsLocked && username.trim().length >= 3 && (
// //                   <p className="-mt-3 mb-4 text-[14px]" style={{ color: usernameStatus === "available" ? OK_TEXT : usernameStatus === "taken" ? ERROR_TEXT : INK_SOFT }}>
// //                     {usernameStatus === "checking" && "Checking availability..."}
// //                     {usernameStatus === "available" && `✓ ${usernameMessage || "Username is available"}`}
// //                     {usernameStatus === "taken" && `✗ ${usernameMessage || "Username is already taken"}`}
// //                     {usernameStatus === "error" && (usernameMessage || "Couldn't check availability, try again")}
// //                   </p>
// //                 )}
// //               </div>

// //               <div className="mb-4">
// //                 <FieldLabel>PHONE NUMBER</FieldLabel>
// //                 <div className="flex flex-col xs:flex-row sm:flex-row gap-2">
// //                   <div ref={phoneCodeBoxRef} className="relative w-full sm:w-[130px] shrink-0">
// //                     <input
// //                       type="text"
// //                       placeholder="Code"
// //                       disabled={fieldsLocked}
// //                       value={
// //                         phoneCodeOpen
// //                           ? phoneCodeQuery
// //                           : (() => {
// //                             const sel = phoneCodeOptions.find((cc) => cc.code === phoneCode)
// //                             return sel ? `${sel.flag} ${sel.code}` : ""
// //                           })()
// //                       }
// //                       onFocus={() => {
// //                         setPhoneCodeOpen(true)
// //                         setPhoneCodeQuery("")
// //                       }}
// //                       onChange={(e) => setPhoneCodeQuery(e.target.value)}
// //                       className="w-full px-3 py-3.5 text-sm outline-none disabled:opacity-40"
// //                       style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
// //                     />
// //                     {phoneCodeOpen && (
// //                       <div
// //                         className="absolute z-20 mt-1 w-56 max-h-56 overflow-y-auto border shadow-lg"
// //                         style={{ borderColor: LINE, background: SURFACE }}
// //                       >
// //                         {filteredPhoneCodes.length === 0 && (
// //                           <div className="px-4 py-3 text-xs" style={{ color: INK_SOFT }}>No matches</div>
// //                         )}
// //                         {filteredPhoneCodes.map((cc) => (
// //                           <button
// //                             key={cc.code}
// //                             type="button"
// //                             onClick={() => {
// //                               setPhoneCode(cc.code)
// //                               setPhoneCodeOpen(false)
// //                               setPhoneCodeQuery("")
// //                             }}
// //                             className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-black/[0.03]"
// //                             style={{ color: INK }}
// //                           >
// //                             <span>{cc.flag}</span>
// //                             <span className="font-medium">{cc.code}</span>
// //                             <span className="text-xs truncate" style={{ color: INK_SOFT }}>{cc.name}</span>
// //                           </button>
// //                         ))}
// //                       </div>
// //                     )}
// //                   </div>
// //                   <input
// //                     type="tel"
// //                     placeholder="Phone number"
// //                     value={phone}
// //                     disabled={fieldsLocked}
// //                     onChange={(e) => setPhone(e.target.value)}
// //                     className="flex-1 min-w-0 px-4 py-3.5 text-sm outline-none disabled:opacity-40"
// //                     style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
// //                     autoComplete="tel"
// //                   />
// //                 </div>
// //               </div>

// //               <div className="mb-4 relative">
// //                 <FieldLabel>PASSWORD</FieldLabel>
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   placeholder="Min 8 chars, uppercase, digit, special"
// //                   value={signupPassword}
// //                   disabled={fieldsLocked}
// //                   onChange={(e) => setSignupPassword(e.target.value)}
// //                   className="w-full px-4 py-3.5 pr-12 text-sm outline-none disabled:opacity-40"
// //                   style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
// //                   autoComplete="new-password"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   disabled={fieldsLocked}
// //                   className="absolute right-4 top-[38px] disabled:opacity-40"
// //                   style={{ color: INK_SOFT }}
// //                 >
// //                   {showPassword ? "🙈" : "👁️"}
// //                 </button>
// //               </div>

// //               <div className="mb-4">
// //                 <FieldLabel>EMAIL ADDRESS</FieldLabel>
// //                 <div className="flex flex-col sm:flex-row gap-2">
// //                   <input
// //                     type="email"
// //                     placeholder="name@email.com"
// //                     value={signupEmail}
// //                     disabled={fieldsLocked || emailVerified}
// //                     onChange={(e) => setSignupEmail(e.target.value)}
// //                     className="flex-1 min-w-0 px-4 py-3.5 text-sm outline-none disabled:opacity-40"
// //                     style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
// //                     autoComplete="email"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={showOtpBox ? handleResendOtp : handleSendOtp}
// //                     disabled={fieldsLocked || registering || resending || emailVerified}
// //                     className="px-4 py-3 sm:py-0 text-xs font-medium shrink-0 border disabled:opacity-40 whitespace-nowrap"
// //                     style={{ borderColor: GOLD, color: GOLD_DARK, background: "rgba(201,138,62,0.05)" }}
// //                   >
// //                     {emailVerified ? "Verified ✓" : showOtpBox ? (resending ? "Resending..." : "Resend OTP") : (registering ? "Sending..." : "Send OTP")}
// //                   </button>
// //                 </div>
// //               </div>

// //               {showOtpBox && !emailVerified && (
// //                 <TextInput label="ENTER OTP" placeholder="6-digit code" maxLength={6} value={otpValue} disabled={fieldsLocked} onChange={(e) => setOtpValue(e.target.value)} autoComplete="one-time-code" />
// //               )}

// //               <div className="flex items-start sm:items-center gap-2 mt-2">
// //                 <input
// //                   type="checkbox"
// //                   id="terms"
// //                   checked={agreedTerms}
// //                   onClick={(e) => {
// //                     if (!agreedTerms) {
// //                       e.preventDefault()
// //                       setHasReadTerms(false)
// //                       setShowTermsModal(true)
// //                     }
// //                   }}
// //                   onChange={(e) => setAgreedTerms(e.target.checked)}
// //                   disabled={fieldsLocked}
// //                   className="disabled:opacity-40 mt-0.5 sm:mt-0 shrink-0"
// //                 />
// //                 <label htmlFor="terms" className={`text-xs ${fieldsLocked ? "opacity-40" : ""}`} style={{ color: INK_SOFT }}>
// //                   I agree to the{" "}
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setHasReadTerms(false)
// //                       setShowTermsModal(true)
// //                     }}
// //                     className="underline"
// //                     style={{ color: GOLD_DARK }}
// //                   >
// //                     Terms and Conditions
// //                   </button>
// //                 </label>
// //               </div>
// //             </div>
// //           )}

// //           {/* ── SIGNUP · STEP: LOCATION ── */}
// //           {isSignUp && currentStepKey === "location" && (
// //             <div>
// //               <button
// //                 type="button"
// //                 onClick={handleUseCurrentLocation}
// //                 disabled={locatingUser}
// //                 className="w-full text-left px-4 py-3.5 text-sm mb-4 disabled:opacity-50"
// //                 style={{ border: `1px solid ${LINE}`, color: INK }}
// //               >
// //                 {locatingUser ? "📍 Locating..." : "📍 Use Current Location"}
// //               </button>

// //               <div ref={countryBoxRef} className="relative mb-4">
// //                 <FieldLabel>COUNTRY</FieldLabel>
// //                 <input
// //                   type="text"
// //                   placeholder="Search country..."
// //                   value={countryOpen ? countryQuery : country}
// //                   onFocus={() => {
// //                     setCountryOpen(true)
// //                     setCountryQuery("")
// //                   }}
// //                   onChange={(e) => setCountryQuery(e.target.value)}
// //                   className="w-full px-4 py-3.5 text-sm outline-none"
// //                   style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
// //                 />
// //                 {countryOpen && (
// //                   <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto border shadow-lg" style={{ borderColor: LINE, background: SURFACE }}>
// //                     {filteredCountries.length === 0 && (
// //                       <div className="px-4 py-3 text-xs" style={{ color: INK_SOFT }}>No matches</div>
// //                     )}
// //                     {filteredCountries.map((c) => (
// //                       <button
// //                         key={c.isoCode}
// //                         type="button"
// //                         onClick={() => {
// //                           setCountry(c.name)
// //                           setCountryOpen(false)
// //                           setCountryQuery("")
// //                         }}
// //                         className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-black/[0.03]"
// //                         style={{ color: INK }}
// //                       >
// //                         <span>{c.flag}</span>
// //                         <span>{c.name}</span>
// //                       </button>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>

// //               <TextInput label="STATE" placeholder="e.g. Telangana" value={stateName} onChange={(e) => setStateName(e.target.value)} />
// //               <TextInput label="CITY" placeholder="e.g. Hyderabad" value={cityName} onChange={(e) => setCityName(e.target.value)} />
// //               <TextAreaInput label="ADDRESS" rows={2} placeholder="Street, area, landmark..." value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
// //             </div>
// //           )}

// //           {/* ── SIGNUP · STEP: PROFILE (Designer / Architect / Contractor only) ── */}
// //           {isSignUp && currentStepKey === "profile" && roleConfig && (
// //             <div>
// //               {roleConfig.fields.map((field) => (
// //                 <div key={field.id}>
// //                   {field.type === "textarea" && (
// //                     <TextAreaInput label={field.label} rows={3} placeholder={field.placeholder} value={roleFields[field.id] || ""} onChange={(e) => setRoleField(field.id, e.target.value)} />
// //                   )}
// //                   {(field.type === "text" || field.type === "number") && (
// //                     <TextInput label={field.label} type={field.type} placeholder={field.placeholder} value={roleFields[field.id] || ""} onChange={(e) => setRoleField(field.id, e.target.value)} />
// //                   )}
// //                   {field.type === "select" && (
// //                     <SelectInput label={field.label} value={roleFields[field.id] || ""} onChange={(e) => setRoleField(field.id, e.target.value)}>
// //                       <option value="">Select {field.label}</option>
// //                       {field.options?.map((opt) => (
// //                         <option key={opt} value={opt}>{opt}</option>
// //                       ))}
// //                     </SelectInput>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           )}

// //           {/* ── SIGNUP · STEP: REVIEW ── */}
// //           {isSignUp && currentStepKey === "review" && (
// //             <div>
// //               <div className="mb-5">
// //                 <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1px" }}>ACCOUNT</div>
// //                 <div className="text-sm space-y-1 break-words" style={{ color: INK_SOFT }}>
// //                   <div>{fullName || "—"} · @{username || "—"}</div>
// //                   <div className="break-all">{signupEmail || "—"}</div>
// //                   <div>{phoneCode} {phone || "—"}</div>
// //                   <div>Role: {ROLE_LABELS[role] || role}</div>                
                  
// //                   </div>
// //               </div>
// //               <div className="h-px my-5" style={{ background: LINE }} />
// //               <div className="mb-5">
// //                 <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1px" }}>LOCATION</div>
// //                 <div className="text-sm space-y-1 break-words" style={{ color: INK_SOFT }}>
// //                   <div>{[cityName, stateName, country].filter(Boolean).join(", ") || "—"}</div>
// //                   {addressLine && <div>{addressLine}</div>}
// //                 </div>
// //               </div>
// //               {roleConfig && roleConfig.fields.length > 0 && (
// //                 <>
// //                   <div className="h-px my-5" style={{ background: LINE }} />
// //                   <div className="mb-2">
// //                     <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1px" }}>PROFILE</div>
// //                     <div className="text-sm space-y-1 break-words" style={{ color: INK_SOFT }}>
// //                       {roleConfig.fields.map((f) => (
// //                         <div key={f.id}>{f.label}: {roleFields[f.id] || "—"}</div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </>
// //               )}
// //             </div>
// //           )}

// //           {/* ── WIZARD NAV ── */}
// //           {isSignUp && (
// //             <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
// //               {!isFirstStep && (
// //                 <GhostButton type="button" onClick={handleWizardBack} className="w-full sm:w-auto sm:px-8">
// //                   Back
// //                 </GhostButton>
// //               )}
// //               <PrimaryButton
// //                 type="button"
// //                 onClick={handleWizardNext}
// //                 disabled={registering || verifying || (currentStepKey === "account" && fieldsLocked)}
// //               >
// //                 {isLastStep ? (verifying ? "Creating Account..." : "Create Account") : "Next"}
// //               </PrimaryButton>
// //             </div>
// //           )}

// //           {isSignUp && (
// //             <div className="text-center mt-6 text-sm" style={{ color: INK_SOFT }}>
// //               Already have an account?{" "}
// //               <button
// //                 type="button"
// //                 onClick={() => {
// //                   setIsSignUp(false)
// //                   setErrorMsg("")
// //                 }}
// //                 className="underline"
// //                 style={{ color: INK }}
// //               >
// //                 Sign In
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       <div className="text-center my-2 pb-10 px-4 text-sm" style={{ color: INK }}>
// //         Want to get matched with the perfect designer?{" "}
// //         <a href="#" className="underline">Take our Style Quiz ›</a>
// //       </div>

// //       {/* ── FORGOT PASSWORD MODAL ── */}
// //       {showForgotModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(31,35,64,0.55)" }}>
// //           <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-8" style={{ background: SURFACE, boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
// //             <button
// //               onClick={() => {
// //                 setShowForgotModal(false)
// //                 setForgotStep("email")
// //                 setForgotOtp("")
// //                 setNewPassword("")
// //                 setConfirmPassword("")
// //                 setErrorMsg("")
// //               }}
// //               className="absolute right-5 top-5"
// //               style={{ color: INK_SOFT }}
// //             >
// //               ✕
// //             </button>

// //             <h3 className="text-xl sm:text-2xl mb-1 pr-6" style={{ fontFamily: "Georgia, serif", color: INK }}>Reset Password</h3>
// //             <p className="text-xs mb-6" style={{ color: INK_SOFT }}>
// //               {forgotStep === "email" && "Enter your email address to receive an OTP."}
// //               {forgotStep === "otp" && "Enter the OTP sent to your email and choose a new password."}
// //             </p>

// //             {errorMsg && (
// //               <div className="mb-4 px-4 py-2 text-xs" style={{ background: ERROR_BG, color: ERROR_TEXT }}>{errorMsg}</div>
// //             )}

// //             {forgotStep === "email" && (
// //               <TextInput label="EMAIL ADDRESS" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} autoComplete="username" />
// //             )}

// //             {forgotStep === "otp" && (
// //               <>
// //                 <TextInput label="OTP" placeholder="6-digit code" maxLength={6} value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} autoComplete="one-time-code" />
// //                 <TextInput label="NEW PASSWORD" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
// //                 <TextInput label="CONFIRM PASSWORD" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
// //               </>
// //             )}

// //             <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
// //               <GhostButton
// //                 type="button"
// //                 onClick={() => {
// //                   setShowForgotModal(false)
// //                   setForgotStep("email")
// //                   setConfirmPassword("")
// //                   setErrorMsg("")
// //                 }}
// //               >
// //                 Cancel
// //               </GhostButton>
// //               <PrimaryButton
// //                 type="button"
// //                 disabled={sendingForgotOtp || verifyingForgotOtp}
// //                 onClick={() => (forgotStep === "email" ? handleForgotSendOtp() : handleForgotVerifyOtp())}
// //               >
// //                 {forgotStep === "email" && (sendingForgotOtp ? "Sending..." : "Send OTP")}
// //                 {forgotStep === "otp" && (verifyingForgotOtp ? "Resetting..." : "Reset Password")}
// //               </PrimaryButton>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ── TERMS AND CONDITIONS MODAL ── */}
// //       {showTermsModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ background: "rgba(31,35,64,0.55)" }}>
// //           <div
// //             className="relative flex w-full sm:w-[85%] lg:w-[70%] max-w-3xl flex-col p-5 sm:p-6 md:p-8"
// //             style={{ background: SURFACE, boxShadow: "0 8px 40px rgba(0,0,0,0.2)", maxHeight: "90vh" }}
// //           >
// //             <button onClick={() => setShowTermsModal(false)} className="absolute right-5 top-5" style={{ color: INK_SOFT }}>✕</button>

// //             <h3 className="text-xl sm:text-2xl mb-1 pr-6" style={{ fontFamily: "Georgia, serif", color: INK }}>Terms and Conditions</h3>
// //             <p className="text-xs mb-4 pr-6" style={{ color: INK_SOFT }}>
// //               {agreedTerms ? "You've already accepted these terms." : hasReadTerms ? "✓ You've reached the end — you can now agree." : "Please scroll to the end to enable the Agree button."}
// //             </p>

// //             <div
// //               ref={termsBodyRef}
// //               onScroll={handleTermsScroll}
// //               className="flex-1 min-h-0 overflow-y-auto text-xs leading-relaxed"
// //               style={{ border: `1px solid ${LINE}`, color: INK_SOFT, padding: "1rem" }}
// //             >
// //               <div className="space-y-3">
// //                 <p><strong>1. Acceptance of Terms.</strong> By creating an account with Night Owl Designers ("NOD"), you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
// //                 <p><strong>2. Eligibility.</strong> You must be at least 18 years old, or the age of majority in your jurisdiction, to register as a Client, Designer, Architect, or Contractor on this platform.</p>
// //                 <p><strong>3. Account Responsibility.</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</p>
// //                 <p><strong>4. Professional Listings.</strong> Designers, Architects, and Contractors represent that all licenses, certifications, and portfolio information provided are accurate and current.</p>
// //                 <p><strong>5. Payments &amp; Fees.</strong> Any service fees, commissions, or payment terms will be disclosed separately at the time of a booking or engagement.</p>
// //                 <p><strong>6. User Conduct.</strong> You agree not to misuse the platform, misrepresent your identity or qualifications, or engage in fraudulent or abusive behavior toward other users.</p>
// //                 <p><strong>7. Content Ownership.</strong> Any designs, images, or materials you upload remain your property, but you grant NOD a limited license to display them within the platform.</p>
// //                 <p><strong>8. Limitation of Liability.</strong> NOD facilitates connections between clients and professionals but is not a party to, and is not liable for, the outcome of any engagement between users.</p>
// //                 <p><strong>9. Termination.</strong> We reserve the right to suspend or terminate accounts that violate these terms or engage in behavior harmful to the platform or its users.</p>
// //                 <p><strong>10. Changes to Terms.</strong> These Terms may be updated from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms.</p>
// //                 <p className="pt-2" style={{ color: INK_SOFT }}>— End of Terms and Conditions —</p>
// //               </div>
// //             </div>

// //             <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
// //               <GhostButton type="button" onClick={() => setShowTermsModal(false)}>Cancel</GhostButton>
// //               <PrimaryButton type="button" disabled={!agreedTerms && !hasReadTerms} onClick={handleAgreeTerms}>
// //                 Agree
// //               </PrimaryButton>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }



// import { useState, useEffect, useRef } from "react"
// import logo from "../assets/logo.png"
// import { Country } from "country-state-city"
// import {
//   useRegisterStartMutation,
//   useRegisterVerifyOtpMutation,
//   useRegisterCreateAccountMutation,
//   useRegisterFinishMutation,
//   useLoginMutation,
//   useForgotStartMutation,
//   useForgotVerifyOtpMutation,
//   useResetPasswordMutation,
//   useChangePwdMutation,
//   useResendOtpMutation,
//   useLazyCheckUsernameQuery,
// } from "../Authentication/authApiSlice"
// import { Check } from "lucide-react";
// import { useNavigate } from "react-router-dom"
// import Cookies from "js-cookie"
// import { useToast } from "../utils/toast"
// import "../theme.css";
// const root = getComputedStyle(document.documentElement);
// import LoginBackground from "../assets/LoginBackground.jpg"
// const INK = root.getPropertyValue("--heading").trim();
// const INK_SOFT = root.getPropertyValue("--text").trim();
// const GOLD = root.getPropertyValue("--gold").trim();
// const GOLD_DARK = root.getPropertyValue("--gold-hover").trim();
// const LINE = root.getPropertyValue("--border").trim();
// const BG = root.getPropertyValue("--background").trim();

// const PRIMARY = root.getPropertyValue("--primary").trim();
// const PRIMARY_HOVER = root.getPropertyValue("--primary-hover").trim();
// const SURFACE = root.getPropertyValue("--surface").trim();

// const ERROR_BG = "#fdecea";
// const ERROR_TEXT = root.getPropertyValue("--danger").trim();
// const OK_TEXT = root.getPropertyValue("--success").trim();


// const ROLE_CODES = {
//   Client: 1,
//   Designer: 2,
//   Architect: 3,
//   Contractor: 4,
//   MaterialSupplier: 5,
// }

// const ROLE_LABELS = {
//   Client: "Client",
//   Designer: "Designer",
//   Architect: "Architect",
//   Contractor: "Contractor",
//   MaterialSupplier: "Material Supplier",
// }

// const ROLE_FIELDS = {
//   Client: { heading: "Almost There", subtitle: "Confirm your location and preferences.", fields: [] },
//   Designer: {
//     heading: "Set Up Your Designer Profile",
//     subtitle: "Showcase your style and attract the right clients.",
//     fields: [
//       { id: "bio", label: "Short Bio", type: "textarea", placeholder: "Tell clients about your design philosophy..." },
//       { id: "specialization", label: "Specialization", type: "select", options: ["Interior Designer", "Exterior Designer", "AutoCAD Designer", "BIM designer", "vastu consultant", "product designer", "Structural Designer", "Landscape Designer", "3D Visualizer"] },
//       { id: "style", label: "Signature Style", type: "select", options: ["Modern", "Minimalist", "Luxury", "Scandinavian", "Industrial", "Eclectic"] },
//       { id: "experience", label: "Years of Experience", type: "number", placeholder: "e.g. 5" },
//       { id: "rate", label: "Hourly Rate (Optional)", type: "number", placeholder: "e.g. 80" },
//     ],
//   },
//   Architect: {
//     heading: "Set Up Your Architect Profile",
//     subtitle: "Highlight your expertise and win more projects.",
//     fields: [
//       { id: "bio", label: "Short Bio", type: "textarea", placeholder: "Describe your architectural approach..." },
//       { id: "specialization", label: "Project Type", type: "select", options: ["Residential", "Commercial", "Mixed-Use", "Industrial", "Urban Planning"] },
//       { id: "software", label: "Primary Software", type: "select", options: ["AutoCAD", "Revit", "ArchiCAD", "SketchUp", "Rhino"] },
//       { id: "experience", label: "Years of Experience", type: "number", placeholder: "e.g. 10" },
//     ],
//   },
//   Contractor: {
//     heading: "Set Up Your Contractor Profile",
//     subtitle: "Show clients what you can build.",
//     fields: [
//       { id: "bio", label: "Company / Personal Bio", type: "textarea", placeholder: "Describe your contracting services..." },
//       { id: "trade", label: "Primary Trade", type: "select", options: ["General Contractor", "Electrical", "Plumbing", "Carpentry", "Masonry", "Painting", "HVAC"] },
//       { id: "experience", label: "Years of Experience", type: "number", placeholder: "e.g. 8" },
//     ],
//   },

//   MaterialSupplier: {
//     heading: "Set Up Your Supplier Profile",
//     subtitle: "List your materials and reach more builders and designers.",
//     fields: [
//       { id: "businessName", label: "Business Name", type: "text", placeholder: "e.g. Sharma Building Materials" },
//       { id: "ownerName", label: "Owner Name", type: "text", placeholder: "e.g. Ramesh Sharma" },
//       { id: "businessType", label: "Business Type", type: "select", options: ["Manufacturer", "Wholesaler", "Retailer", "Distributor", "Importer"] },
//     ],
//   },
// }

// const STEP_META = {
//   account: { label: "Account" },
//   location: { label: "Location" },
//   profile: { label: "Profile" },
//   review: { label: "Review" },
// }

// function getStepsForRole(role) {
//   if (!role) return ["account"]
//   const hasProfileFields = (ROLE_FIELDS[role]?.fields || []).length > 0
//   return hasProfileFields ? ["account", "location", "profile", "review"] : ["account", "location", "review"]
// }

// /* ────────────────────────────────────────────────────────────────
//    SMALL REUSABLE PIECES
// ──────────────────────────────────────────────────────────────── */

// function FieldLabel({ children }) {
//   return (
//     <div className="text-[10px] font-semibold mb-2" style={{ color: INK, letterSpacing: "1.5px" }}>
//       {children}
//     </div>
//   )
// }

// function TextInput({ label, disabled, className = "", ...props }) {
//   return (
//     <div className="mb-4">
//       {label && <FieldLabel>{label}</FieldLabel>}
//       <input
//         {...props}
//         disabled={disabled}
//         className={`w-full px-4 py-3.5 text-sm outline-none transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
//         style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
//       />
//     </div>
//   )
// }

// function SelectInput({ label, disabled, children, ...props }) {
//   return (
//     <div className="mb-4">
//       {label && <FieldLabel>{label}</FieldLabel>}
//       <select
//         {...props}
//         disabled={disabled}
//         className={`w-full px-4 py-3.5 text-sm outline-none appearance-none ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
//         style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
//       >
//         {children}
//       </select>
//     </div>
//   )
// }

// function TextAreaInput({ label, disabled, ...props }) {
//   return (
//     <div className="mb-4">
//       {label && <FieldLabel>{label}</FieldLabel>}
//       <textarea
//         {...props}
//         disabled={disabled}
//         className={`w-full px-4 py-3.5 text-sm outline-none resize-none ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
//         style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
//       />
//     </div>
//   )
// }

// function PrimaryButton({ children, className = "", ...props }) {
//   return (
//     <button
//       {...props}
//       className={`w-full py-4 text-white text-sm tracking-wide disabled:opacity-50 transition-colors duration-300 ${className}`}
//       style={{ background: PRIMARY }}
//       onMouseEnter={(e) => !props.disabled && (e.currentTarget.style.background = PRIMARY_HOVER)}
//       onMouseLeave={(e) => !props.disabled && (e.currentTarget.style.background = PRIMARY)}
//     >
//       {children}
//     </button>
//   )
// }

// function GhostButton({ children, className = "", ...props }) {
//   return (
//     <button
//       {...props}
//       className={`w-full py-4 text-sm tracking-wide border disabled:opacity-40 ${className}`}
//       style={{ borderColor: INK_SOFT, color: INK }}
//     >
//       {children}
//     </button>
//   )
// }

// function StepProgress({ stepKeys, currentKey }) {
//   const currentIndex = stepKeys.indexOf(currentKey)
//   return (
//     <div className="flex items-center mb-8">
//       {stepKeys.map((key, i) => {
//         const done = i < currentIndex
//         const active = i === currentIndex
//         return (
//           <div key={key} className="flex items-center" style={{ flex: i === stepKeys.length - 1 ? "0 0 auto" : 1 }}>
//             <div className="flex flex-col items-center" style={{ minWidth: 64 }}>
//               <div
//                 className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] shrink-0"
//                 style={{
//                   border: `1px solid ${done || active ? GOLD : LINE}`,
//                   background: done ? GOLD : "transparent",
//                   color: done ? "#fff" : active ? GOLD : INK_SOFT,
//                   fontWeight: 600,
//                 }}
//               >
//                 {done ? "✓" : i + 1}
//               </div>
//               <div
//                 className="mt-1.5 text-[10px] text-center"
//                 style={{ color: active ? GOLD : INK_SOFT, fontWeight: active ? 600 : 400, letterSpacing: "0.5px" }}
//               >
//                 {STEP_META[key].label}
//               </div>
//             </div>
//             {i !== stepKeys.length - 1 && (
//               <div className="h-px flex-1 mx-1" style={{ background: done ? GOLD : LINE, marginBottom: 18 }} />
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// function WelcomeBackCard() {
//   const highlights = [
//     "Message your designer directly",
//     "Track proposals & invoices",
//     "See your project timeline",
//   ]
//   return (
//     <div className="w-72 p-8 shrink-0" style={{ background: SURFACE, boxShadow: "0 2px 18px rgba(0,0,0,0.08)" }}>
//       <div
//         className="w-36 h-36 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center"
//         style={{ background: "linear-gradient(160deg,#efe6da,#e2d6c4)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)" }}
//       >
//         <svg viewBox="0 0 170 170" className="w-full h-full">
//           <rect width="170" height="170" fill="#e9dfd0" />
//           <rect x="20" y="20" width="40" height="30" fill="#d7c4a3" stroke={GOLD} strokeWidth="2" />
//           <circle cx="95" cy="35" r="16" fill="#b8cfc4" />
//           <rect x="30" y="80" width="90" height="55" fill="#f6f2ea" />
//           <circle cx="120" cy="70" r="24" fill="#e0c9a6" />
//           <rect x="107" y="94" width="26" height="40" fill={PRIMARY} />
//         </svg>
//       </div>

//       <div className="text-center mb-6">
//         <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1.5px" }}>
//           WELCOME BACK
//         </div>
//         <div className="w-9 h-0.5 mx-auto" style={{ background: GOLD }} />
//       </div>

//       <div className="flex flex-col gap-5">
//         {highlights.map((h, i) => (
//           <div
//             key={i}
//             className="flex items-center gap-3 text-sm leading-tight"
//             style={{ color: INK_SOFT }}
//           >
//             <div
//               className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
//               style={{ background: GOLD }}
//             >
//               <Check size={14} color="white" strokeWidth={3} />
//             </div>
//             {h}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// /* ────────────────────────────────────────────────────────────────
//    MAIN COMPONENT
// ──────────────────────────────────────────────────────────────── */

// export default function LoginPage() {
//   const navigate = useNavigate()

//   const [isSignUp, setIsSignUp] = useState(false)
//   const [step, setStep] = useState(1)
//   const [role, setRole] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [phoneCode, setPhoneCode] = useState("+91")
//   const [country, setCountry] = useState("")
//   const [roleFields, setRoleFields] = useState({})
//   const [showForgotModal, setShowForgotModal] = useState(false)
//   const [showTermsModal, setShowTermsModal] = useState(false)
//   const [hasReadTerms, setHasReadTerms] = useState(false)
//   const [errorMsg, setErrorMsg] = useState("")
//   const [newPassword, setNewPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")

//   const [loginEmail, setLoginEmail] = useState("")
//   const [loginPassword, setLoginPassword] = useState("")
//   const toast = useToast()

//   const [fullName, setFullName] = useState("")
//   const [username, setUsername] = useState("")
//   const [phone, setPhone] = useState("")
//   const [signupEmail, setSignupEmail] = useState("")
//   const [signupPassword, setSignupPassword] = useState("")
//   const [agreedTerms, setAgreedTerms] = useState(false)

//   const [showOtpBox, setShowOtpBox] = useState(false)
//   const [otpValue, setOtpValue] = useState("")
//   const [emailVerified, setEmailVerified] = useState(false)
//   const [registerSessionToken, setRegisterSessionToken] = useState("")

//   const [stateName, setStateName] = useState("")
//   const [cityName, setCityName] = useState("")
//   const [addressLine, setAddressLine] = useState("")
//   const [locatingUser, setLocatingUser] = useState(false)

//   const [forgotEmail, setForgotEmail] = useState("")
//   const [forgotStep, setForgotStep] = useState("email")
//   const [forgotOtp, setForgotOtp] = useState("")
//   const [forgotSessionToken, setForgotSessionToken] = useState("")

//   const [usernameStatus, setUsernameStatus] = useState("idle")
//   const [usernameMessage, setUsernameMessage] = useState("")
//   const usernameDebounceRef = useRef(null)
//   const termsBodyRef = useRef(null)

//   const [countryQuery, setCountryQuery] = useState("")
//   const [countryOpen, setCountryOpen] = useState(false)
//   const countryBoxRef = useRef(null)
//   const allCountries = useRef(Country.getAllCountries()).current

//   const [phoneCodeQuery, setPhoneCodeQuery] = useState("")
//   const [phoneCodeOpen, setPhoneCodeOpen] = useState(false)
//   const phoneCodeBoxRef = useRef(null)

//   const phoneCodeOptions = useRef(
//     Array.from(
//       new Map(
//         allCountries
//           .filter((c) => c.phonecode)
//           .map((c) => {
//             const code = c.phonecode.startsWith("+") ? c.phonecode : `+${c.phonecode}`
//             return [code, { code, flag: c.flag, name: c.name }]
//           })
//       ).values()
//     ).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
//   ).current

//   const filteredCountries = countryQuery.trim()
//     ? allCountries.filter((c) => c.name.toLowerCase().includes(countryQuery.trim().toLowerCase()))
//     : allCountries

//   useEffect(() => {
//     const handleClick = (e) => {
//       if (countryBoxRef.current && !countryBoxRef.current.contains(e.target)) {
//         setCountryOpen(false)
//       }
//       if (phoneCodeBoxRef.current && !phoneCodeBoxRef.current.contains(e.target)) {
//         setPhoneCodeOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClick)
//     return () => document.removeEventListener("mousedown", handleClick)
//   }, [])

//   const filteredPhoneCodes = phoneCodeQuery.trim()
//     ? phoneCodeOptions.filter(
//       (cc) =>
//         cc.code.includes(phoneCodeQuery.trim()) ||
//         cc.name.toLowerCase().includes(phoneCodeQuery.trim().toLowerCase())
//     )
//     : phoneCodeOptions

//   // ── Mutations ──
//   const [registerStart, { isLoading: registerStarting }] = useRegisterStartMutation()
//   const [registerVerifyOtp, { isLoading: verifyingOtp }] = useRegisterVerifyOtpMutation()
//   const [registerCreateAccount, { isLoading: creatingAccount }] = useRegisterCreateAccountMutation()
//   const [registerFinish, { isLoading: finishingRegister }] = useRegisterFinishMutation()
//   const [login, { isLoading: loggingIn }] = useLoginMutation()
//   const [forgotStart, { isLoading: sendingForgotOtp }] = useForgotStartMutation()
//   const [forgotVerifyOtp, { isLoading: verifyingForgotOtp }] = useForgotVerifyOtpMutation()
//   const [resetPassword] = useResetPasswordMutation()
//   const [resendOtp, { isLoading: resending }] = useResendOtpMutation()
//   const [triggerCheckUsername] = useLazyCheckUsernameQuery()

//   const roleConfig = role ? ROLE_FIELDS[role] : null
//   const fieldsLocked = !role

//   // ── Wizard bookkeeping ──
//   const stepKeys = getStepsForRole(role)
//   const currentIndex = Math.min(step, stepKeys.length) - 1
//   const currentStepKey = stepKeys[currentIndex] || "account"
//   const isFirstStep = currentIndex === 0
//   const isLastStep = currentIndex === stepKeys.length - 1

//   const setRoleField = (id, value) => setRoleFields((prev) => ({ ...prev, [id]: value }))

//   const handleTermsScroll = (e) => {
//     const { scrollTop, scrollHeight, clientHeight } = e.target
//     if (scrollTop + clientHeight >= scrollHeight - 8) setHasReadTerms(true)
//   }

//   useEffect(() => {
//     if (!showTermsModal || !termsBodyRef.current) return
//     const el = termsBodyRef.current
//     if (el.scrollHeight <= el.clientHeight + 8) setHasReadTerms(true)
//   }, [showTermsModal])

//   const getErrMsg = (err) => err?.data?.message || err?.error || "Something went wrong. Please try again."

//   // ── LOGIN ──
//   const handleSignIn = async () => {
//     setErrorMsg("")
//     try {
//       const res = await login({ email: loginEmail.toLowerCase(), password: loginPassword }).unwrap()
//       Cookies.set("token", res.data.token, { expires: 7 })
//       localStorage.setItem("userData", JSON.stringify(res.data))
//       toast.success("Signed in successfully")
//       navigate("/dashboard")
//     } catch (err) {
//       setErrorMsg(getErrMsg(err))
//     }
//   }

//   // ── Username check (debounced) ──
//   useEffect(() => {
//     if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current)
//     const trimmed = username.trim()
//     if (!trimmed || trimmed.length < 3) {
//       setUsernameStatus("idle")
//       return
//     }
//     setUsernameStatus("checking")
//     setUsernameMessage("")
//     usernameDebounceRef.current = setTimeout(async () => {
//       try {
//         const res = await triggerCheckUsername(trimmed).unwrap()
//         setUsernameStatus(res?.available ? "available" : "taken")
//         setUsernameMessage(res?.message || "")
//       } catch (err) {
//         setUsernameStatus("error")
//         setUsernameMessage(err?.data?.message || "")
//       }
//     }, 500)
//     return () => clearTimeout(usernameDebounceRef.current)
//   }, [username])

//   // ── REGISTER · STEP 1: Send OTP (registerStart) ──
//   const handleSendOtp = async () => {
//     setErrorMsg("")
//     if (!role) return setErrorMsg("Please select a role")
//     if (!fullName.trim()) return setErrorMsg("Please enter your name")
//     if (!username.trim()) return setErrorMsg("Please enter a username")
//     if (usernameStatus === "taken") return setErrorMsg(usernameMessage || "That username is already taken.")
//     if (!phone.trim()) return setErrorMsg("Please enter your phone number")
//     if (!signupEmail) return setErrorMsg("Enter your email first")
//     if (!signupPassword) return setErrorMsg("Enter a password")
//     if (!agreedTerms) return setErrorMsg("Please accept the Terms and Conditions")

//     try {
//       const res = await registerStart({
//         name: fullName,
//         username,
//         countryCode: phoneCode,
//         phone,
//         email: signupEmail.toLowerCase(),
//         password: signupPassword,
//         role: ROLE_CODES[role],
//       }).unwrap()
//       setRegisterSessionToken(res.data.registerSessionToken)
//       setShowOtpBox(true)
//       toast.success("OTP sent to your email")
//     } catch (err) {
//       setErrorMsg(getErrMsg(err))
//     }
//   }

//   // ── REGISTER · Resend OTP ──
//   const handleResendOtp = async () => {
//     setErrorMsg("")
//     try {
//       await resendOtp({ registerSessionToken }).unwrap()
//       toast.success("OTP resent")
//     } catch (err) {
//       setErrorMsg(getErrMsg(err))
//     }
//   }

//   // ── Geolocation ──
//   const handleUseCurrentLocation = () => {
//     setErrorMsg("")
//     if (!navigator.geolocation) return setErrorMsg("Geolocation is not supported by your browser")
//     setLocatingUser(true)
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords
//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
//             { headers: { "Accept-Language": "en" } }
//           )
//           const data = await res.json()
//           const addr = data.address || {}
//           setCountry(addr.country || "")
//           setStateName(addr.state || "")
//           setCityName(addr.city || addr.town || addr.village || "")
//           setAddressLine(data.display_name || "")
//         } catch {
//           setErrorMsg("Could not resolve address from location")
//         } finally {
//           setLocatingUser(false)
//         }
//       },
//       () => {
//         setLocatingUser(false)
//         setErrorMsg("Location permission denied or unavailable")
//       }
//     )
//   }

//   // ── REGISTER · STEP 2: Verify OTP (registerVerifyOtp) ──
//   const handleVerifyOtpAndProceed = async () => {
//     setErrorMsg("")
//     if (!otpValue.trim()) return setErrorMsg("Please enter the OTP")

//     try {
//       const res = await registerVerifyOtp({
//         registerSessionToken,
//         otp: otpValue,
//       }).unwrap()
//       setEmailVerified(true)
//       setRegisterSessionToken(res.data.registerSessionToken)
//       setStep((s) => s + 1) // Move to location step
//       toast.success("Email verified")
//     } catch (err) {
//       setErrorMsg(getErrMsg(err))
//     }
//   }

//   // ── REGISTER · STEP 3: Save Location (registerCreateAccount) ──
//   const handleSaveLocation = async () => {
//     setErrorMsg("")
//     if (!country.trim()) return setErrorMsg("Please select your country")
//     if (!cityName.trim()) return setErrorMsg("Please enter your city")

//     try {
//       const res = await registerCreateAccount({
//         registerSessionToken,
//         country,
//         state: stateName,
//         city: cityName,
//         address: addressLine,
//         roleFields: {},
//       }).unwrap()
//       setRegisterSessionToken(res.data.registerSessionToken)
//       setStep((s) => s + 1) // Move to profile or review
//       toast.success("Location saved")
//     } catch (err) {
//       setErrorMsg(getErrMsg(err))
//     }
//   }

//   // ── REGISTER · STEP 3b: Save Profile (registerCreateAccount) ──
//   const handleSaveProfile = async () => {
//     setErrorMsg("")

//     try {
//       const res = await registerCreateAccount({
//         registerSessionToken,
//         country,
//         state: stateName,
//         city: cityName,
//         address: addressLine,
//         roleFields,
//       }).unwrap()
//       setRegisterSessionToken(res.data.registerSessionToken)
//       setStep((s) => s + 1) // Move to review
//       toast.success("Profile saved")
//     } catch (err) {
//       setErrorMsg(getErrMsg(err))
//     }
//   }

//   // ── REGISTER · STEP 4: Finish (registerFinish) ──
//   const handleCreateAccount = async () => {
//     setErrorMsg("")

//     try {
//       const res = await registerFinish({
//         registerSessionToken,
//       }).unwrap()
//       Cookies.set("token", res.data.token, { expires: 7 })
//       localStorage.setItem("userData", JSON.stringify(res.data))
//       toast.success("Account created successfully")
//       navigate("/dashboard")
//     } catch (err) {
//       setErrorMsg(getErrMsg(err))
//     }
//   }

//   // ── FORGOT PASSWORD · STEP 1: Start ──
//   const handleForgotSendOtp = async () => {
//     setErrorMsg("")
//     if (!forgotEmail) return setErrorMsg("Please enter your email")

//     try {
//       const res = await forgotStart({ email: forgotEmail.toLowerCase() }).unwrap()
//       setForgotSessionToken(res.data.forgotSessionToken)
//       setForgotStep("otp")
//       toast.success("OTP sent")
//     } catch (err) {
//       setErrorMsg(getErrMsg(err))
//     }
//   }

//   // ── FORGOT PASSWORD · STEP 2: Verify OTP ──
//   const handleForgotVerifyOtp = async () => {
//     setErrorMsg("")
//     if (!forgotOtp) return setErrorMsg("Please enter the OTP")

//     try {
//       const res = await forgotVerifyOtp({
//         forgotSessionToken,
//         otp: forgotOtp,
//       }).unwrap()
//       setForgotSessionToken(res.data.forgotSessionToken)
//       setForgotStep("reset")
//       toast.success("OTP verified")
//     } catch (err) {
//       setErrorMsg(getErrMsg(err))
//     }
//   }

//   // ── FORGOT PASSWORD · STEP 3: Reset ──
//   const handleResetPassword = async () => {
//     setErrorMsg("")
//     if (!newPassword || !confirmPassword) return setErrorMsg("Please enter and confirm your new password")
//     if (newPassword !== confirmPassword) return setErrorMsg("Passwords do not match")

//     try {
//       await resetPassword({
//         forgotSessionToken,
//         newPassword,
//       }).unwrap()
//       setShowForgotModal(false)
//       setForgotStep("email")
//       setForgotEmail("")
//       setForgotOtp("")
//       setNewPassword("")
//       setConfirmPassword("")
//       setForgotSessionToken("")
//       toast.success("Password reset successfully")
//     } catch (err) {
//       setErrorMsg(getErrMsg(err))
//     }
//   }

//   const handleAgreeTerms = () => {
//     setAgreedTerms(true)
//     setShowTermsModal(false)
//   }

//   // ── Validation ──
//   const validateAccountStep = () => {
//     if (!role) return "Please select a role to continue"
//     if (usernameStatus === "taken") return usernameMessage || "That username is already taken."
//     if (!showOtpBox) return "Please send the OTP to your email first"
//     if (!otpValue) return "Please enter the OTP sent to your email"
//     if (!emailVerified) return "Please verify your email first"
//     if (!agreedTerms) return "Please accept the Terms and Conditions"
//     return null
//   }

//   const validateLocationStep = () => {
//     if (!country) return "Please select your country"
//     if (!cityName.trim()) return "Please enter your city"
//     return null
//   }

//   // ── Wizard Navigation ──
//   const handleWizardNext = async () => {
//     setErrorMsg("")

//     if (currentStepKey === "account") {
//       const err = validateAccountStep()
//       if (err) return setErrorMsg(err)
//       setStep((s) => s + 1)
//     } else if (currentStepKey === "location") {
//       const err = validateLocationStep()
//       if (err) return setErrorMsg(err)
//       await handleSaveLocation()
//     } else if (currentStepKey === "profile") {
//       await handleSaveProfile()
//     } else if (currentStepKey === "review") {
//       await handleCreateAccount()
//     }
//   }

//   const handleWizardBack = () => setStep((s) => Math.max(1, s - 1))

//   const resetSignupState = () => {
//     setStep(1)
//     setRole("")
//     setRoleFields({})
//     setErrorMsg("")
//     setShowOtpBox(false)
//     setEmailVerified(false)
//     setUsernameStatus("idle")
//     setUsernameMessage("")
//     setRegisterSessionToken("")
//     setOtpValue("")
//   }

//   const stepHeading = () => {
//     if (!isSignUp) return "Sign In to Night Owl Designers"
//     if (currentStepKey === "account") return "Create Your Account"
//     if (currentStepKey === "location") return "Where Are You Based?"
//     if (currentStepKey === "profile") return roleConfig?.heading || "Set Up Your Profile"
//     return "Review & Confirm"
//   }

//   const stepSubtitle = () => {
//     if (!isSignUp) return "Welcome back — let's get you home."
//     if (currentStepKey === "account") return "Everyone deserves a beautiful home."
//     if (currentStepKey === "location") return "This helps us match you with the right people nearby."
//     if (currentStepKey === "profile") return roleConfig?.subtitle || ""
//     return "Take a look before you submit — you can still go back and change anything."
//   }

//   return (
//     <div
//       className="min-h-screen w-full"
//       style={{
//         background: BG,
//         backgroundImage: `url(${LoginBackground})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         backgroundAttachment: "scroll",
//       }}
//     >
//       {/* ── HEADER ── */}
//       <header
//         className="border-b py-4 sm:py-6 px-4 flex items-center justify-center gap-2 sm:gap-3"
//         style={{ borderColor: LINE, background: SURFACE }}
//       >
//         <img src={logo} alt="Night Owl Designers" className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover shrink-0" />
//         <h1
//           className="text-base sm:text-xl md:text-2xl font-normal text-center tracking-[2px] sm:tracking-[4px] md:tracking-[6px]"
//           style={{ fontFamily: "Georgia, serif", color: INK }}
//         >
//           NIGHT OWL DESIGNERS
//         </h1>
//       </header>

//       <div className="relative flex justify-center items-start mt-6 sm:mt-10 md:mt-14 px-3 sm:px-4 pb-10 md:pb-14">
//         {!isSignUp && (
//           <div className="hidden lg:block" style={{ marginTop: 44, marginRight: -30, zIndex: 2, position: "relative" }}>
//             <WelcomeBackCard />
//           </div>
//         )}

//         <div
//           className={`w-full max-w-full p-5 sm:p-8 md:p-14 relative ${isSignUp ? "sm:w-[540px] md:w-[640px]" : "sm:w-[440px] md:w-[490px]"}`}
//           style={{ background: SURFACE, boxShadow: "0 2px 18px rgba(0,0,0,0.08)", zIndex: 1 }}
//         >
//           <h2 className="text-2xl sm:text-3xl mb-2" style={{ fontFamily: "Georgia, serif", color: INK }}>
//             {stepHeading()}
//           </h2>
//           <p className="mb-6 sm:mb-7 text-sm sm:text-base" style={{ color: INK_SOFT }}>
//             {stepSubtitle()}
//           </p>

//           {isSignUp && <StepProgress stepKeys={stepKeys} currentKey={currentStepKey} />}

//           {errorMsg && (
//             <div className="mb-5 px-4 py-3 text-xs" style={{ background: ERROR_BG, color: ERROR_TEXT }}>
//               {errorMsg}
//             </div>
//           )}

//           {/* ── SIGN IN ── */}
//           {!isSignUp && (
//             <form
//               autoComplete="on"
//               onSubmit={(e) => {
//                 e.preventDefault()
//                 if (!loggingIn) handleSignIn()
//               }}
//             >
//               <TextInput
//                 label="EMAIL ADDRESS"
//                 type="email"
//                 name="username"
//                 autoComplete="username"
//                 value={loginEmail}
//                 onChange={(e) => setLoginEmail(e.target.value)}
//               />
//               <div className="mb-2 relative">
//                 <FieldLabel>PASSWORD</FieldLabel>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="current-password"
//                   autoComplete="current-password"
//                   value={loginPassword}
//                   onChange={(e) => setLoginPassword(e.target.value)}
//                   className="w-full px-4 py-3.5 pr-12 text-sm outline-none"
//                   style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-[38px]"
//                   style={{ color: INK_SOFT }}
//                 >
//                   {showPassword ? "🙈" : "👁️"}
//                 </button>
//               </div>
//               <div className="text-right mb-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowForgotModal(true)}
//                   className="text-xs underline"
//                   style={{ color: GOLD_DARK }}
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               <PrimaryButton type="submit" disabled={loggingIn}>
//                 {loggingIn ? "Signing In..." : "Sign In"}
//               </PrimaryButton>

//               <div className="flex items-center gap-4 my-7">
//                 <div className="h-px flex-1" style={{ background: LINE }} />
//                 <span className="text-[10px] tracking-widest uppercase" style={{ color: INK_SOFT }}>or</span>
//                 <div className="h-px flex-1" style={{ background: LINE }} />
//               </div>

//               <button
//                 type="button"
//                 className="w-full flex items-center justify-center gap-2 py-3.5 text-sm border"
//                 style={{ borderColor: LINE, color: INK }}
//               >
//                 <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                   <g>
//                     <path d="m0 0H512V512H0" fill="#fff" />
//                     <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
//                     <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
//                     <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
//                     <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
//                   </g>
//                 </svg>
//                 Continue with Google
//               </button>

//               <div className="text-center mt-6 text-sm" style={{ color: INK_SOFT }}>
//                 New to NOD?{" "}
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsSignUp(true)
//                     resetSignupState()
//                   }}
//                   className="underline"
//                   style={{ color: INK }}
//                 >
//                   Sign Up
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* ── SIGNUP · STEP: ACCOUNT ── */}
//           {isSignUp && currentStepKey === "account" && (
//             <div>
//               <div className="mb-5">
//                 <FieldLabel>SELECT ROLE</FieldLabel>
//                 <div className="flex flex-wrap gap-2">
//                   {Object.keys(ROLE_LABELS).map((item) => (
//                     <button
//                       key={item}
//                       type="button"
//                       onClick={() => setRole(item)}
//                       className="rounded-full px-4 py-2 text-xs transition-all"
//                       style={
//                         role === item
//                           ? { background: GOLD, color: "#fff" }
//                           : { background: "rgba(201,138,62,0.08)", color: INK_SOFT }
//                       }
//                     >
//                       {ROLE_LABELS[item]}
//                     </button>
//                   ))}
//                 </div>
//                 {fieldsLocked && (
//                   <p className="mt-2 text-[11px]" style={{ color: GOLD_DARK }}>
//                     Select a role to continue.
//                   </p>
//                 )}
//               </div>

//               <TextInput label="NAME" placeholder="John Doe" value={fullName} disabled={fieldsLocked} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />

//               <div className="mb-1">
//                 <TextInput label="USERNAME" placeholder="johndoe123" value={username} disabled={fieldsLocked} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
//                 {!fieldsLocked && username.trim().length >= 3 && (
//                   <p className="-mt-3 mb-4 text-[14px]" style={{ color: usernameStatus === "available" ? OK_TEXT : usernameStatus === "taken" ? ERROR_TEXT : INK_SOFT }}>
//                     {usernameStatus === "checking" && "Checking availability..."}
//                     {usernameStatus === "available" && `✓ ${usernameMessage || "Username is available"}`}
//                     {usernameStatus === "taken" && `✗ ${usernameMessage || "Username is already taken"}`}
//                     {usernameStatus === "error" && (usernameMessage || "Couldn't check availability, try again")}
//                   </p>
//                 )}
//               </div>

//               <div className="mb-4">
//                 <FieldLabel>PHONE NUMBER</FieldLabel>
//                 <div className="flex flex-col xs:flex-row sm:flex-row gap-2">
//                   <div ref={phoneCodeBoxRef} className="relative w-full sm:w-[130px] shrink-0">
//                     <input
//                       type="text"
//                       placeholder="Code"
//                       disabled={fieldsLocked}
//                       value={
//                         phoneCodeOpen
//                           ? phoneCodeQuery
//                           : (() => {
//                             const sel = phoneCodeOptions.find((cc) => cc.code === phoneCode)
//                             return sel ? `${sel.flag} ${sel.code}` : ""
//                           })()
//                       }
//                       onFocus={() => {
//                         setPhoneCodeOpen(true)
//                         setPhoneCodeQuery("")
//                       }}
//                       onChange={(e) => setPhoneCodeQuery(e.target.value)}
//                       className="w-full px-3 py-3.5 text-sm outline-none disabled:opacity-40"
//                       style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
//                     />
//                     {phoneCodeOpen && (
//                       <div
//                         className="absolute z-20 mt-1 w-56 max-h-56 overflow-y-auto border shadow-lg"
//                         style={{ borderColor: LINE, background: SURFACE }}
//                       >
//                         {filteredPhoneCodes.length === 0 && (
//                           <div className="px-4 py-3 text-xs" style={{ color: INK_SOFT }}>No matches</div>
//                         )}
//                         {filteredPhoneCodes.map((cc) => (
//                           <button
//                             key={cc.code}
//                             type="button"
//                             onClick={() => {
//                               setPhoneCode(cc.code)
//                               setPhoneCodeOpen(false)
//                               setPhoneCodeQuery("")
//                             }}
//                             className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-black/[0.03]"
//                             style={{ color: INK }}
//                           >
//                             <span>{cc.flag}</span>
//                             <span className="font-medium">{cc.code}</span>
//                             <span className="text-xs truncate" style={{ color: INK_SOFT }}>{cc.name}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                   <input
//                     type="tel"
//                     placeholder="Phone number"
//                     value={phone}
//                     disabled={fieldsLocked}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="flex-1 min-w-0 px-4 py-3.5 text-sm outline-none disabled:opacity-40"
//                     style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
//                     autoComplete="tel"
//                   />
//                 </div>
//               </div>

//               <div className="mb-4 relative">
//                 <FieldLabel>PASSWORD</FieldLabel>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Min 8 chars, uppercase, digit, special"
//                   value={signupPassword}
//                   disabled={fieldsLocked}
//                   onChange={(e) => setSignupPassword(e.target.value)}
//                   className="w-full px-4 py-3.5 pr-12 text-sm outline-none disabled:opacity-40"
//                   style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
//                   autoComplete="new-password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={fieldsLocked}
//                   className="absolute right-4 top-[38px] disabled:opacity-40"
//                   style={{ color: INK_SOFT }}
//                 >
//                   {showPassword ? "🙈" : "👁️"}
//                 </button>
//               </div>

//               <div className="mb-4">
//                 <FieldLabel>EMAIL ADDRESS</FieldLabel>
//                 <div className="flex flex-col sm:flex-row gap-2">
//                   <input
//                     type="email"
//                     placeholder="name@email.com"
//                     value={signupEmail}
//                     disabled={fieldsLocked || emailVerified}
//                     onChange={(e) => setSignupEmail(e.target.value)}
//                     className="flex-1 min-w-0 px-4 py-3.5 text-sm outline-none disabled:opacity-40"
//                     style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
//                     autoComplete="email"
//                   />
//                   <button
//                     type="button"
//                     onClick={showOtpBox ? handleResendOtp : handleSendOtp}
//                     disabled={fieldsLocked || registerStarting || resending || emailVerified}
//                     className="px-4 py-3 sm:py-0 text-xs font-medium shrink-0 border disabled:opacity-40 whitespace-nowrap"
//                     style={{ borderColor: GOLD, color: GOLD_DARK, background: "rgba(201,138,62,0.05)" }}
//                   >
//                     {emailVerified ? "Verified ✓" : showOtpBox ? (resending ? "Resending..." : "Resend OTP") : (registerStarting ? "Sending..." : "Send OTP")}
//                   </button>
//                 </div>
//               </div>

//               {showOtpBox && !emailVerified && (
//                 <div>
//                   <TextInput 
//                     label="ENTER OTP" 
//                     placeholder="6-digit code" 
//                     maxLength={6} 
//                     value={otpValue} 
//                     disabled={fieldsLocked} 
//                     onChange={(e) => setOtpValue(e.target.value)} 
//                     autoComplete="one-time-code" 
//                   />
//                   <button
//                     type="button"
//                     onClick={handleVerifyOtpAndProceed}
//                     disabled={!otpValue || verifyingOtp}
//                     className="w-full px-4 py-2 text-xs mb-4 border rounded transition-all"
//                     style={{ borderColor: GOLD, color: GOLD_DARK, background: "rgba(201,138,62,0.05)" }}
//                   >
//                     {verifyingOtp ? "Verifying..." : "Verify OTP"}
//                   </button>
//                 </div>
//               )}

//               <div className="flex items-start sm:items-center gap-2 mt-2">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   checked={agreedTerms}
//                   onClick={(e) => {
//                     if (!agreedTerms) {
//                       e.preventDefault()
//                       setHasReadTerms(false)
//                       setShowTermsModal(true)
//                     }
//                   }}
//                   onChange={(e) => setAgreedTerms(e.target.checked)}
//                   disabled={fieldsLocked}
//                   className="disabled:opacity-40 mt-0.5 sm:mt-0 shrink-0"
//                 />
//                 <label htmlFor="terms" className={`text-xs ${fieldsLocked ? "opacity-40" : ""}`} style={{ color: INK_SOFT }}>
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setHasReadTerms(false)
//                       setShowTermsModal(true)
//                     }}
//                     className="underline"
//                     style={{ color: GOLD_DARK }}
//                   >
//                     Terms and Conditions
//                   </button>
//                 </label>
//               </div>
//             </div>
//           )}

//           {/* ── SIGNUP · STEP: LOCATION ── */}
//           {isSignUp && currentStepKey === "location" && (
//             <div>
//               <button
//                 type="button"
//                 onClick={handleUseCurrentLocation}
//                 disabled={locatingUser}
//                 className="w-full text-left px-4 py-3.5 text-sm mb-4 disabled:opacity-50"
//                 style={{ border: `1px solid ${LINE}`, color: INK }}
//               >
//                 {locatingUser ? "📍 Locating..." : "📍 Use Current Location"}
//               </button>

//               <div ref={countryBoxRef} className="relative mb-4">
//                 <FieldLabel>COUNTRY</FieldLabel>
//                 <input
//                   type="text"
//                   placeholder="Search country..."
//                   value={countryOpen ? countryQuery : country}
//                   onFocus={() => {
//                     setCountryOpen(true)
//                     setCountryQuery("")
//                   }}
//                   onChange={(e) => setCountryQuery(e.target.value)}
//                   className="w-full px-4 py-3.5 text-sm outline-none"
//                   style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
//                 />
//                 {countryOpen && (
//                   <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto border shadow-lg" style={{ borderColor: LINE, background: SURFACE }}>
//                     {filteredCountries.length === 0 && (
//                       <div className="px-4 py-3 text-xs" style={{ color: INK_SOFT }}>No matches</div>
//                     )}
//                     {filteredCountries.map((c) => (
//                       <button
//                         key={c.isoCode}
//                         type="button"
//                         onClick={() => {
//                           setCountry(c.name)
//                           setCountryOpen(false)
//                           setCountryQuery("")
//                         }}
//                         className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-black/[0.03]"
//                         style={{ color: INK }}
//                       >
//                         <span>{c.flag}</span>
//                         <span>{c.name}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <TextInput label="STATE" placeholder="e.g. Telangana" value={stateName} onChange={(e) => setStateName(e.target.value)} />
//               <TextInput label="CITY" placeholder="e.g. Hyderabad" value={cityName} onChange={(e) => setCityName(e.target.value)} />
//               <TextAreaInput label="ADDRESS" rows={2} placeholder="Street, area, landmark..." value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
//             </div>
//           )}

//           {/* ── SIGNUP · STEP: PROFILE ── */}
//           {isSignUp && currentStepKey === "profile" && roleConfig && (
//             <div>
//               {roleConfig.fields.map((field) => (
//                 <div key={field.id}>
//                   {field.type === "textarea" && (
//                     <TextAreaInput label={field.label} rows={3} placeholder={field.placeholder} value={roleFields[field.id] || ""} onChange={(e) => setRoleField(field.id, e.target.value)} />
//                   )}
//                   {(field.type === "text" || field.type === "number") && (
//                     <TextInput label={field.label} type={field.type} placeholder={field.placeholder} value={roleFields[field.id] || ""} onChange={(e) => setRoleField(field.id, e.target.value)} />
//                   )}
//                   {field.type === "select" && (
//                     <SelectInput label={field.label} value={roleFields[field.id] || ""} onChange={(e) => setRoleField(field.id, e.target.value)}>
//                       <option value="">Select {field.label}</option>
//                       {field.options?.map((opt) => (
//                         <option key={opt} value={opt}>{opt}</option>
//                       ))}
//                     </SelectInput>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* ── SIGNUP · STEP: REVIEW ── */}
//           {isSignUp && currentStepKey === "review" && (
//             <div>
//               <div className="mb-5">
//                 <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1px" }}>ACCOUNT</div>
//                 <div className="text-sm space-y-1 break-words" style={{ color: INK_SOFT }}>
//                   <div>{fullName || "—"} · @{username || "—"}</div>
//                   <div className="break-all">{signupEmail || "—"}</div>
//                   <div>{phoneCode} {phone || "—"}</div>
//                   <div>Role: {ROLE_LABELS[role] || role}</div>
//                 </div>
//               </div>
//               <div className="h-px my-5" style={{ background: LINE }} />
//               <div className="mb-5">
//                 <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1px" }}>LOCATION</div>
//                 <div className="text-sm space-y-1 break-words" style={{ color: INK_SOFT }}>
//                   <div>{[cityName, stateName, country].filter(Boolean).join(", ") || "—"}</div>
//                   {addressLine && <div>{addressLine}</div>}
//                 </div>
//               </div>
//               {roleConfig && roleConfig.fields.length > 0 && (
//                 <>
//                   <div className="h-px my-5" style={{ background: LINE }} />
//                   <div className="mb-2">
//                     <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1px" }}>PROFILE</div>
//                     <div className="text-sm space-y-1 break-words" style={{ color: INK_SOFT }}>
//                       {roleConfig.fields.map((f) => (
//                         <div key={f.id}>{f.label}: {roleFields[f.id] || "—"}</div>
//                       ))}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* ── WIZARD NAV ── */}
//           {isSignUp && (
//             <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
//               {!isFirstStep && (
//                 <GhostButton type="button" onClick={handleWizardBack} className="w-full sm:w-auto sm:px-8">
//                   Back
//                 </GhostButton>
//               )}
//               <PrimaryButton
//                 type="button"
//                 onClick={handleWizardNext}
//                 disabled={
//                   registerStarting || 
//                   verifyingOtp || 
//                   creatingAccount || 
//                   finishingRegister ||
//                   (currentStepKey === "account" && (!emailVerified || !otpValue))
//                 }
//               >
//                 {isLastStep ? (finishingRegister ? "Creating Account..." : "Create Account") : "Next"}
//               </PrimaryButton>
//             </div>
//           )}

//           {isSignUp && (
//             <div className="text-center mt-6 text-sm" style={{ color: INK_SOFT }}>
//               Already have an account?{" "}
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsSignUp(false)
//                   setErrorMsg("")
//                 }}
//                 className="underline"
//                 style={{ color: INK }}
//               >
//                 Sign In
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="text-center my-2 pb-10 px-4 text-sm" style={{ color: INK }}>
//         Want to get matched with the perfect designer?{" "}
//         <a href="#" className="underline">Take our Style Quiz ›</a>
//       </div>

//       {/* ── FORGOT PASSWORD MODAL ── */}
//       {showForgotModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(31,35,64,0.55)" }}>
//           <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-8" style={{ background: SURFACE, boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
//             <button
//               onClick={() => {
//                 setShowForgotModal(false)
//                 setForgotStep("email")
//                 setForgotOtp("")
//                 setNewPassword("")
//                 setConfirmPassword("")
//                 setErrorMsg("")
//                 setForgotSessionToken("")
//               }}
//               className="absolute right-5 top-5"
//               style={{ color: INK_SOFT }}
//             >
//               ✕
//             </button>

//             <h3 className="text-xl sm:text-2xl mb-1 pr-6" style={{ fontFamily: "Georgia, serif", color: INK }}>Reset Password</h3>
//             <p className="text-xs mb-6" style={{ color: INK_SOFT }}>
//               {forgotStep === "email" && "Enter your email address to receive an OTP."}
//               {forgotStep === "otp" && "Enter the OTP sent to your email."}
//               {forgotStep === "reset" && "Choose a new password."}
//             </p>

//             {errorMsg && (
//               <div className="mb-4 px-4 py-2 text-xs" style={{ background: ERROR_BG, color: ERROR_TEXT }}>{errorMsg}</div>
//             )}

//             {forgotStep === "email" && (
//               <TextInput label="EMAIL ADDRESS" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} autoComplete="username" />
//             )}

//             {forgotStep === "otp" && (
//               <TextInput label="OTP" placeholder="6-digit code" maxLength={6} value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} autoComplete="one-time-code" />
//             )}

//             {forgotStep === "reset" && (
//               <>
//                 <TextInput label="NEW PASSWORD" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
//                 <TextInput label="CONFIRM PASSWORD" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
//               </>
//             )}

//             <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
//               <GhostButton
//                 type="button"
//                 onClick={() => {
//                   setShowForgotModal(false)
//                   setForgotStep("email")
//                   setConfirmPassword("")
//                   setErrorMsg("")
//                   setForgotSessionToken("")
//                 }}
//               >
//                 Cancel
//               </GhostButton>
//               <PrimaryButton
//                 type="button"
//                 disabled={
//                   forgotStep === "email" ? sendingForgotOtp : 
//                   forgotStep === "otp" ? verifyingForgotOtp :
//                   false
//                 }
//                 onClick={() => {
//                   if (forgotStep === "email") handleForgotSendOtp()
//                   else if (forgotStep === "otp") handleForgotVerifyOtp()
//                   else if (forgotStep === "reset") handleResetPassword()
//                 }}
//               >
//                 {forgotStep === "email" && (sendingForgotOtp ? "Sending..." : "Send OTP")}
//                 {forgotStep === "otp" && (verifyingForgotOtp ? "Verifying..." : "Verify OTP")}
//                 {forgotStep === "reset" && "Reset Password"}
//               </PrimaryButton>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── TERMS AND CONDITIONS MODAL ── */}
//       {showTermsModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ background: "rgba(31,35,64,0.55)" }}>
//           <div
//             className="relative flex w-full sm:w-[85%] lg:w-[70%] max-w-3xl flex-col p-5 sm:p-6 md:p-8"
//             style={{ background: SURFACE, boxShadow: "0 8px 40px rgba(0,0,0,0.2)", maxHeight: "90vh" }}
//           >
//             <button onClick={() => setShowTermsModal(false)} className="absolute right-5 top-5" style={{ color: INK_SOFT }}>✕</button>

//             <h3 className="text-xl sm:text-2xl mb-1 pr-6" style={{ fontFamily: "Georgia, serif", color: INK }}>Terms and Conditions</h3>
//             <p className="text-xs mb-4 pr-6" style={{ color: INK_SOFT }}>
//               {agreedTerms ? "You've already accepted these terms." : hasReadTerms ? "✓ You've reached the end — you can now agree." : "Please scroll to the end to enable the Agree button."}
//             </p>

//             <div
//               ref={termsBodyRef}
//               onScroll={handleTermsScroll}
//               className="flex-1 min-h-0 overflow-y-auto text-xs leading-relaxed"
//               style={{ border: `1px solid ${LINE}`, color: INK_SOFT, padding: "1rem" }}
//             >
//               <div className="space-y-3">
//                 <p><strong>1. Acceptance of Terms.</strong> By creating an account with Night Owl Designers ("NOD"), you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
//                 <p><strong>2. Eligibility.</strong> You must be at least 18 years old, or the age of majority in your jurisdiction, to register as a Client, Designer, Architect, or Contractor on this platform.</p>
//                 <p><strong>3. Account Responsibility.</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</p>
//                 <p><strong>4. Professional Listings.</strong> Designers, Architects, and Contractors represent that all licenses, certifications, and portfolio information provided are accurate and current.</p>
//                 <p><strong>5. Payments &amp; Fees.</strong> Any service fees, commissions, or payment terms will be disclosed separately at the time of a booking or engagement.</p>
//                 <p><strong>6. User Conduct.</strong> You agree not to misuse the platform, misrepresent your identity or qualifications, or engage in fraudulent or abusive behavior toward other users.</p>
//                 <p><strong>7. Content Ownership.</strong> Any designs, images, or materials you upload remain your property, but you grant NOD a limited license to display them within the platform.</p>
//                 <p><strong>8. Limitation of Liability.</strong> NOD facilitates connections between clients and professionals but is not a party to, and is not liable for, the outcome of any engagement between users.</p>
//                 <p><strong>9. Termination.</strong> We reserve the right to suspend or terminate accounts that violate these terms or engage in behavior harmful to the platform or its users.</p>
//                 <p><strong>10. Changes to Terms.</strong> These Terms may be updated from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms.</p>
//                 <p className="pt-2" style={{ color: INK_SOFT }}>— End of Terms and Conditions —</p>
//               </div>
//             </div>

//             <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
//               <GhostButton type="button" onClick={() => setShowTermsModal(false)}>Cancel</GhostButton>
//               <PrimaryButton type="button" disabled={!agreedTerms && !hasReadTerms} onClick={handleAgreeTerms}>
//                 Agree
//               </PrimaryButton>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
