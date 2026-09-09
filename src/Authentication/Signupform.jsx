

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useToast } from "../utils/toast"
import {
    useRegisterStartMutation,
    useRegisterVerifyOtpMutation,
    useRegisterCreateAccountMutation,
    useRegisterFinishMutation,
    useResendOtpMutation,
    useLazyCheckUsernameQuery,
    useGetCategoriesAndSpecializationsQuery,
    useGetCurrencyQuery,
} from "../Authentication/authApiSlice"
import {
    INK, INK_SOFT, GOLD, GOLD_DARK, LINE, SURFACE, ERROR_BG, ERROR_TEXT, OK_TEXT,
    ROLE_LABELS, ROLE_FIELDS, STEP_META, getStepsForRole, getErrMsg,
    allCountriesList,
    FieldLabel, TextInput, SelectInput, TextAreaInput, PrimaryButton, GhostButton, StepProgress,
    TurnstileWidget,
    RateInput, getCurrencyForPhoneAndCountry,
    DEFAULT_DESIGNER_CATEGORIES,
} from "./authShared"

/* ────────────────────────────────────────────────────────────────
   TERMS AND CONDITIONS MODAL — only ever mounted from sign-up
──────────────────────────────────────────────────────────────── */
function TermsModal({ agreedTerms, onAgree, onClose }) {
    const [hasReadTerms, setHasReadTerms] = useState(false)
    const termsBodyRef = useRef(null)

    useEffect(() => {
        if (!termsBodyRef.current) return
        const el = termsBodyRef.current
        if (el.scrollHeight <= el.clientHeight + 8) setHasReadTerms(true)
    }, [])

    const handleTermsScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target
        if (scrollTop + clientHeight >= scrollHeight - 8) setHasReadTerms(true)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ background: "rgba(31,35,64,0.55)" }}>
            <div
                className="relative flex w-full sm:w-[85%] lg:w-[70%] max-w-3xl flex-col p-5 sm:p-6 md:p-8"
                style={{ background: SURFACE, boxShadow: "0 8px 40px rgba(0,0,0,0.2)", maxHeight: "90vh" }}
            >
                <button onClick={onClose} className="absolute right-5 top-5" style={{ color: INK_SOFT }}>✕</button>

                <h3 className="text-xl sm:text-2xl mb-1 pr-6" style={{ fontFamily: "Georgia, serif", color: INK }}>Terms and Conditions</h3>
                <p className="text-xs mb-4 pr-6" style={{ color: INK_SOFT }}>
                    {agreedTerms ? "You've already accepted these terms." : hasReadTerms ? "✓ You've reached the end — you can now agree." : "Please scroll to the end to enable the Agree button."}
                </p>

                <div
                    ref={termsBodyRef}
                    onScroll={handleTermsScroll}
                    className="flex-1 min-h-0 overflow-y-auto text-xs leading-relaxed"
                    style={{ border: `1px solid ${LINE}`, color: INK_SOFT, padding: "1rem" }}
                >
                    <div className="space-y-3">
                        <p><strong>1. Acceptance of Terms.</strong> By creating an account with Night Owl Designers ("NOD"), you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
                        <p><strong>2. Eligibility.</strong> You must be at least 18 years old, or the age of majority in your jurisdiction, to register as a Client, Designer, Architect, or Contractor on this platform.</p>
                        <p><strong>3. Account Responsibility.</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</p>
                        <p><strong>4. Professional Listings.</strong> Designers, Architects, and Contractors represent that all licenses, certifications, and portfolio information provided are accurate and current.</p>
                        <p><strong>5. Payments &amp; Fees.</strong> Any service fees, commissions, or payment terms will be disclosed separately at the time of a booking or engagement.</p>
                        <p><strong>6. User Conduct.</strong> You agree not to misuse the platform, misrepresent your identity or qualifications, or engage in fraudulent or abusive behavior toward other users.</p>
                        <p><strong>7. Content Ownership.</strong> Any designs, images, or materials you upload remain your property, but you grant NOD a limited license to display them within the platform.</p>
                        <p><strong>8. Limitation of Liability.</strong> NOD facilitates connections between clients and professionals but is not a party to, and is not liable for, the outcome of any engagement between users.</p>
                        <p><strong>9. Termination.</strong> We reserve the right to suspend or terminate accounts that violate these terms or engage in behavior harmful to the platform or its users.</p>
                        <p><strong>10. Changes to Terms.</strong> These Terms may be updated from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms.</p>
                        <p className="pt-2" style={{ color: INK_SOFT }}>— End of Terms and Conditions —</p>
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                    <GhostButton type="button" onClick={onClose}>Cancel</GhostButton>
                    <PrimaryButton type="button" disabled={!agreedTerms && !hasReadTerms} onClick={onAgree}>
                        Agree
                    </PrimaryButton>
                </div>
            </div>
        </div>
    )
}

/* ────────────────────────────────────────────────────────────────
   SIGN UP WIZARD
──────────────────────────────────────────────────────────────── */
export default function SignUpForm({ onSwitchToLogin }) {
    const navigate = useNavigate()
    const toast = useToast()

    const [step, setStep] = useState(1)
    const [role, setRole] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [phoneCode, setPhoneCode] = useState("+91")
    const [country, setCountry] = useState("")
    const [roleFields, setRoleFields] = useState({})
    const [showTermsModal, setShowTermsModal] = useState(false)
    // Error is shown right above the wizard's Back/Next buttons — i.e. right
    // where the user's eyes and cursor already are when they click. No
    // scrolling needed since it's never off-screen relative to the button
    // that triggered it.
    const [errorMsg, setErrorMsg] = useState("")

    const [fullName, setFullName] = useState("")
    const [username, setUsername] = useState("")
    const [phone, setPhone] = useState("")
    const [signupEmail, setSignupEmail] = useState("")
    const [signupPassword, setSignupPassword] = useState("")
    const [agreedTerms, setAgreedTerms] = useState(false)

    // ── Turnstile captcha (register/start requires captchaToken) ──
    const [captchaToken, setCaptchaToken] = useState("")
    const [captchaResetKey, setCaptchaResetKey] = useState(0)

    const [showOtpBox, setShowOtpBox] = useState(false)
    const [otpValue, setOtpValue] = useState("")
    const [emailVerified, setEmailVerified] = useState(false)
    const [registerSessionToken, setRegisterSessionToken] = useState("")

    const [stateName, setStateName] = useState("")
    const [cityName, setCityName] = useState("")
    const [addressLine, setAddressLine] = useState("")
    const [locatingUser, setLocatingUser] = useState(false)

    const [usernameStatus, setUsernameStatus] = useState("idle")
    const [usernameMessage, setUsernameMessage] = useState("")
    const usernameDebounceRef = useRef(null)

    const [countryQuery, setCountryQuery] = useState("")
    const [countryOpen, setCountryOpen] = useState(false)
    const countryBoxRef = useRef(null)
    const allCountries = useRef(allCountriesList).current

    const [phoneCodeQuery, setPhoneCodeQuery] = useState("")
    const [phoneCodeOpen, setPhoneCodeOpen] = useState(false)
    const phoneCodeBoxRef = useRef(null)

    const phoneCodeOptions = useRef(
        Array.from(
            new Map(
                allCountries
                    .filter((c) => c.phonecode)
                    .map((c) => {
                        const code = c.phonecode.startsWith("+") ? c.phonecode : `+${c.phonecode}`
                        return [code, { code, flag: c.flag, name: c.name }]
                    })
            ).values()
        ).sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
    ).current

    const filteredCountries = countryQuery.trim()
        ? allCountries.filter((c) => c.name.toLowerCase().includes(countryQuery.trim().toLowerCase()))
        : allCountries

    const filteredPhoneCodes = phoneCodeQuery.trim()
        ? phoneCodeOptions.filter(
            (cc) =>
                cc.code.includes(phoneCodeQuery.trim()) ||
                cc.name.toLowerCase().includes(phoneCodeQuery.trim().toLowerCase())
        )
        : phoneCodeOptions

    useEffect(() => {
        const handleClick = (e) => {
            if (countryBoxRef.current && !countryBoxRef.current.contains(e.target)) setCountryOpen(false)
            if (phoneCodeBoxRef.current && !phoneCodeBoxRef.current.contains(e.target)) setPhoneCodeOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    // ── Mutations & Category API Query ──
    const [registerStart, { isLoading: registerStarting }] = useRegisterStartMutation()
    const [registerVerifyOtp, { isLoading: verifyingOtp }] = useRegisterVerifyOtpMutation()
    const [registerCreateAccount, { isLoading: creatingAccount }] = useRegisterCreateAccountMutation()
    const [registerFinish, { isLoading: finishingRegister }] = useRegisterFinishMutation()
    const [resendOtp, { isLoading: resending }] = useResendOtpMutation()
    const [triggerCheckUsername] = useLazyCheckUsernameQuery()

    // Dynamically fetch categories from backend category API
    const {
        data: categoriesResponse,
        isLoading: isLoadingCategories,
        isError: isCategoriesError,
    } = useGetCategoriesAndSpecializationsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })

    // Dynamic currency resolution based on mobile phoneCode and country
    const localCurrency = getCurrencyForPhoneAndCountry(phoneCode, country)
    const { data: serverCurrencyRes } = useGetCurrencyQuery(
        { phoneCode, country },
        { skip: !phoneCode && !country }
    )
    const resolvedCurrency = serverCurrencyRes?.data || localCurrency

    const categoriesList = (Array.isArray(categoriesResponse?.data) && categoriesResponse.data.length > 0)
        ? categoriesResponse.data
        : DEFAULT_DESIGNER_CATEGORIES

    const selectedCategoryObj = categoriesList.find(
        (c) => c.name === roleFields.category || c.id === roleFields.category
    )
    const availableSpecializations = selectedCategoryObj?.specializations || []

    const roleConfig = role ? ROLE_FIELDS[role] : null
    // Group the role's dynamic fields into rows of two for a compact
    // two-column layout. Textareas always get their own full row.
    const profileRows = []
    if (roleConfig) {
        let pending = null
        roleConfig.fields.forEach((field) => {
            const pairable = field.type === "text" || field.type === "number" || field.type === "category" || field.type === "specialization" || field.type === "select" || field.type === "rate"
            if (!pairable) {
                if (pending) {
                    profileRows.push([pending])
                    pending = null
                }
                profileRows.push([field])
            } else if (pending) {
                profileRows.push([pending, field])
                pending = null
            } else {
                pending = field
            }
        })
        if (pending) profileRows.push([pending])
    }
    const fieldsLocked = !role

    // ── Wizard bookkeeping ──
    const stepKeys = getStepsForRole(role)
    const currentIndex = Math.min(step, stepKeys.length) - 1
    const currentStepKey = stepKeys[currentIndex] || "account"
    const isFirstStep = currentIndex === 0
    const isLastStep = currentIndex === stepKeys.length - 1

    const setRoleField = (id, value) => setRoleFields((prev) => ({ ...prev, [id]: value }))

    // Turnstile tokens are single-use and short-lived — burn the widget
    // and force a fresh solve after every attempt (success or failure).
    const resetCaptcha = () => {
        setCaptchaToken("")
        setCaptchaResetKey((k) => k + 1)
    }

    // ── Username check (debounced) ──
    useEffect(() => {
        if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current)
        const trimmed = username.trim()
        if (!trimmed || trimmed.length < 3) {
            setUsernameStatus("idle")
            return
        }
        setUsernameStatus("checking")
        setUsernameMessage("")
        usernameDebounceRef.current = setTimeout(async () => {
            try {
                const res = await triggerCheckUsername(trimmed).unwrap()
                setUsernameStatus(res?.available ? "available" : "taken")
                setUsernameMessage(res?.message || "")
            } catch (err) {
                setUsernameStatus("error")
                setUsernameMessage(err?.data?.message || "")
            }
        }, 500)
        return () => clearTimeout(usernameDebounceRef.current)
    }, [username])

    // ── REGISTER · STEP 1: Send OTP (registerStart) ──
    const handleSendOtp = async () => {
        setErrorMsg("")
        if (!role) return setErrorMsg("Please select a role")
        if (!fullName.trim()) return setErrorMsg("Please enter your name")
        if (!username.trim()) return setErrorMsg("Please enter a username")
        if (usernameStatus === "taken") return setErrorMsg(usernameMessage || "That username is already taken.")
        if (!phone.trim()) return setErrorMsg("Please enter your phone number")
        if (!signupEmail) return setErrorMsg("Enter your email first")
        if (!signupPassword) return setErrorMsg("Enter a password")
        if (!agreedTerms) return setErrorMsg("Please accept the Terms and Conditions")
        if (!captchaToken) return setErrorMsg("Please complete the captcha")

        try {
            const res = await registerStart({
                name: fullName,
                username,
                countryCode: phoneCode,
                phone,
                email: signupEmail.toLowerCase(),
                password: signupPassword,
                role: role, // e.g. "Designer" — backend maps this string to its numeric code
                captchaToken,
            }).unwrap()
            setRegisterSessionToken(res.data.registerSessionToken)
            setShowOtpBox(true)
            toast.success("OTP sent to your email")
        } catch (err) {
            setErrorMsg(getErrMsg(err))
        } finally {
            // The token was consumed by this request either way — get a new one.
            resetCaptcha()
        }
    }

    // ── REGISTER · Resend OTP ──
    const handleResendOtp = async () => {
        setErrorMsg("")
        try {
            await resendOtp({ registerSessionToken }).unwrap()
            toast.success("OTP resent")
        } catch (err) {
            setErrorMsg(getErrMsg(err))
        }
    }

    // ── Geolocation ──
    const handleUseCurrentLocation = () => {
        setErrorMsg("")
        if (!navigator.geolocation) return setErrorMsg("Geolocation is not supported by your browser")
        setLocatingUser(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                        { headers: { "Accept-Language": "en" } }
                    )
                    const data = await res.json()
                    const addr = data.address || {}
                    setCountry(addr.country || "")
                    setStateName(addr.state || "")
                    setCityName(addr.city || addr.town || addr.village || "")
                    setAddressLine(data.display_name || "")
                } catch {
                    setErrorMsg("Could not resolve address from location")
                } finally {
                    setLocatingUser(false)
                }
            },
            () => {
                setLocatingUser(false)
                setErrorMsg("Location permission denied or unavailable")
            }
        )
    }

    // ── REGISTER · STEP 2: Verify OTP (registerVerifyOtp) ──
    const handleVerifyOtpAndProceed = async () => {
        setErrorMsg("")
        if (!otpValue.trim()) return setErrorMsg("Please enter the OTP")
        try {
            const res = await registerVerifyOtp({ registerSessionToken, otp: otpValue }).unwrap()
            setEmailVerified(true)
            setRegisterSessionToken(res.data.registerSessionToken)
            setStep((s) => s + 1) // Move to location step
            toast.success("Email verified")
        } catch (err) {
            setErrorMsg(getErrMsg(err))
        }
    }

    // ── REGISTER · STEP 3: Save Location (registerCreateAccount) ──
    const handleSaveLocation = async () => {
        setErrorMsg("")
        if (!country.trim()) return setErrorMsg("Please select your country")
        if (!cityName.trim()) return setErrorMsg("Please enter your city")

        try {
            // Save location to backend immediately. Do NOT send roleFields here so Category is not validated on this step.
            const res = await registerCreateAccount({
                registerSessionToken,
                country,
                state: stateName,
                city: cityName,
                address: addressLine,
            }).unwrap()
            if (res?.data?.registerSessionToken) {
                setRegisterSessionToken(res.data.registerSessionToken)
            }
            setStep((s) => s + 1) // Move to next step (Profile for Designer, Review for Client)
            toast.success("Location saved")
        } catch (err) {
            setErrorMsg(getErrMsg(err))
        }
    }

    // ── REGISTER · STEP 3b: Save Profile (registerCreateAccount) ──
    const handleSaveProfile = async () => {
        setErrorMsg("")
        if (role === "Designer") {
            if (!roleFields.category) return setErrorMsg("Please select a Category")
            if (!roleFields.specialization) return setErrorMsg("Please select a Specialization")
            if (!roleFields.specializationLevel) return setErrorMsg("Please select a Specialization Level")
        }
        if (roleFields.bio && /\d/.test(roleFields.bio)) {
            return setErrorMsg("Bio cannot contain numbers")
        }
        if (roleFields.rate !== undefined && roleFields.rate !== "" && Number(roleFields.rate) < 0) {
            return setErrorMsg("Hourly rate cannot be negative")
        }
        try {
            const payloadRoleFields = { ...roleFields }
            if (payloadRoleFields.rate !== undefined && payloadRoleFields.rate !== "") {
                payloadRoleFields.currency = resolvedCurrency?.currency || "INR"
            }
            const res = await registerCreateAccount({
                registerSessionToken,
                country,
                state: stateName,
                city: cityName,
                address: addressLine,
                roleFields: payloadRoleFields,
            }).unwrap()
            if (res?.data?.registerSessionToken) {
                setRegisterSessionToken(res.data.registerSessionToken)
            }
            setStep((s) => s + 1) // Move to review
            toast.success("Profile saved")
        } catch (err) {
            setErrorMsg(getErrMsg(err))
        }
    }

    // ── REGISTER · STEP 4: Finish (registerFinish) ──
    const handleCreateAccount = async () => {
        setErrorMsg("")
        try {
            const res = await registerFinish({ registerSessionToken }).unwrap()
            Cookies.set("token", res.data.token, { expires: 7 })
            localStorage.setItem("userData", JSON.stringify(res.data))
            toast.success("Account created successfully")
            navigate("/dashboard")
        } catch (err) {
            setErrorMsg(getErrMsg(err))
        }
    }

    const handleAgreeTerms = () => {
        setAgreedTerms(true)
        setShowTermsModal(false)
    }

    // ── Validation ──
    const validateAccountStep = () => {
        if (!role) return "Please select a role to continue"
        if (usernameStatus === "taken") return usernameMessage || "That username is already taken."
        if (!showOtpBox) return "Please send the OTP to your email first"
        if (!otpValue) return "Please enter the OTP sent to your email"
        if (!emailVerified) return "Please verify your email first"
        if (!agreedTerms) return "Please accept the Terms and Conditions"
        return null
    }

    const validateLocationStep = () => {
        if (!country) return "Please select your country"
        if (!cityName.trim()) return "Please enter your city"
        return null
    }

    // ── Wizard Navigation ──
    const handleWizardNext = async () => {
        setErrorMsg("")
        if (currentStepKey === "account") {
            const err = validateAccountStep()
            if (err) return setErrorMsg(err)
            setStep((s) => s + 1)
        } else if (currentStepKey === "location") {
            const err = validateLocationStep()
            if (err) return setErrorMsg(err)
            await handleSaveLocation()
        } else if (currentStepKey === "profile") {
            await handleSaveProfile()
        } else if (currentStepKey === "review") {
            await handleCreateAccount()
        }
    }

    const handleWizardBack = () => setStep((s) => Math.max(1, s - 1))

    const stepHeading = () => {
        if (currentStepKey === "account") return "Create Your Account"
        if (currentStepKey === "location") return "Where Are You Based?"
        if (currentStepKey === "profile") return roleConfig?.heading || "Set Up Your Profile"
        return "Review & Confirm"
    }

    const stepSubtitle = () => {
        if (currentStepKey === "account") return "Everyone deserves a beautiful home."
        if (currentStepKey === "location") return "This helps us match you with the right people nearby."
        if (currentStepKey === "profile") return roleConfig?.subtitle || ""
        return "Take a look before you submit — you can still go back and change anything."
    }

    return (
        <div
            className="w-full max-w-full p-5 sm:p-8 md:p-14 relative sm:w-[540px] md:w-[640px]"
            style={{ background: SURFACE, boxShadow: "0 2px 18px rgba(0,0,0,0.08)", zIndex: 1 }}
        >
            <h2 className="text-2xl sm:text-3xl mb-2" style={{ fontFamily: "Georgia, serif", color: INK }}>
                {stepHeading()}
            </h2>
            <p className="mb-6 sm:mb-7 text-sm sm:text-base" style={{ color: INK_SOFT }}>
                {stepSubtitle()}
            </p>

            <StepProgress stepKeys={stepKeys} currentKey={currentStepKey} />

            {/* ── STEP: ACCOUNT ── */}
            {currentStepKey === "account" && (
                <div>
                    <div className="mb-5">
                        <FieldLabel>SELECT ROLE</FieldLabel>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(ROLE_LABELS).map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setRole(item)}
                                    className="rounded-full px-4 py-2 text-xs transition-all"
                                    style={
                                        role === item
                                            ? { background: GOLD, color: "#fff" }
                                            : { background: "rgba(201,138,62,0.08)", color: INK_SOFT }
                                    }
                                >
                                    {ROLE_LABELS[item]}
                                </button>
                            ))}
                        </div>
                        {fieldsLocked && (
                            <p className="mt-2 text-[11px]" style={{ color: GOLD_DARK }}>
                                Select a role to continue.
                            </p>
                        )}
                    </div>

                    {/* Real, native disabling — fieldset blocks focus, click, tab, and screen-reader
            interaction for every descendant control in one shot. */}
                    <fieldset
                        disabled={fieldsLocked}
                        className={fieldsLocked ? "opacity-40 pointer-events-none" : ""}
                        style={{ border: "none", padding: 0, margin: 0 }}
                    >
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                                <TextInput label="NAME" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
                            </div>
                            <div className="flex-1 min-w-0 mb-1">
                                <TextInput label="USERNAME" placeholder="johndoe123" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
                                {!fieldsLocked && username.trim().length >= 3 && (
                                    <p className="-mt-3 mb-4 text-[14px]" style={{ color: usernameStatus === "available" ? OK_TEXT : usernameStatus === "taken" ? ERROR_TEXT : INK_SOFT }}>
                                        {usernameStatus === "checking" && "Checking availability..."}
                                        {usernameStatus === "available" && `✓ ${usernameMessage || "Username is available"}`}
                                        {usernameStatus === "taken" && `✗ ${usernameMessage || "Username is already taken"}`}
                                        {usernameStatus === "error" && (usernameMessage || "Couldn't check availability, try again")}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                                <FieldLabel>PHONE NUMBER</FieldLabel>
                                {/* <div className="flex flex-col xs:flex-row sm:flex-row gap-2">
                                    <div ref={phoneCodeBoxRef} className="relative w-full sm:w-[90px] shrink-0">
                                        <input
                                            type="text"
                                            placeholder="Code"
                                            value={
                                                phoneCodeOpen
                                                    ? phoneCodeQuery
                                                    : (() => {
                                                        const sel = phoneCodeOptions.find((cc) => cc.code === phoneCode)
                                                        return sel ? `${sel.flag} ${sel.code}` : ""
                                                    })()
                                            }
                                            onFocus={() => {
                                                setPhoneCodeOpen(true)
                                                setPhoneCodeQuery("")
                                            }}
                                            onChange={(e) => setPhoneCodeQuery(e.target.value)}
                                            className="w-full px-2 py-2.5 text-xs outline-none"
                                            style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
                                        />
                                        {phoneCodeOpen && (
                                            <div className="absolute z-20 mt-1 w-56 max-h-56 overflow-y-auto border shadow-lg" style={{ borderColor: LINE, background: SURFACE }}>
                                                {filteredPhoneCodes.length === 0 && (
                                                    <div className="px-4 py-3 text-xs" style={{ color: INK_SOFT }}>No matches</div>
                                                )}
                                                {filteredPhoneCodes.map((cc) => (
                                                    <button
                                                        key={cc.code}
                                                        type="button"
                                                        onClick={() => {
                                                            setPhoneCode(cc.code)
                                                            setPhoneCodeOpen(false)
                                                            setPhoneCodeQuery("")
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-black/[0.03]"
                                                        style={{ color: INK }}
                                                    >
                                                        <span>{cc.flag}</span>
                                                        <span className="font-medium">{cc.code}</span>
                                                        <span className="text-xs truncate" style={{ color: INK_SOFT }}>{cc.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex-1 min-w-0 px-3 py-2.5 text-xs outline-none"
                                        style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
                                        autoComplete="tel"
                                    />
                                </div> */}

                                <div className="flex flex-col xs:flex-row sm:flex-row gap-2">
                                    <div ref={phoneCodeBoxRef} className="relative w-full sm:w-[60px] shrink-0">
                                        <input
                                            type="text"
                                            placeholder="Code"
                                            value={
                                                phoneCodeOpen
                                                    ? phoneCodeQuery
                                                    : (() => {
                                                        const sel = phoneCodeOptions.find((cc) => cc.code === phoneCode)
                                                        return sel ? `${sel.flag} ${sel.code}` : ""
                                                    })()
                                            }
                                            onFocus={() => {
                                                setPhoneCodeOpen(true)
                                                setPhoneCodeQuery("")
                                            }}
                                            onChange={(e) => setPhoneCodeQuery(e.target.value)}
                                            className="w-full px-1.5 py-2.5 text-xs outline-none"
                                            style={{
                                                border: `1px solid ${LINE}`,
                                                color: INK,
                                                background: "transparent"
                                            }}
                                        />

                                        {phoneCodeOpen && (
                                            <div
                                                className="absolute z-20 mt-1 w-56 max-h-56 overflow-y-auto border shadow-lg"
                                                style={{
                                                    borderColor: LINE,
                                                    background: SURFACE
                                                }}
                                            >
                                                {filteredPhoneCodes.length === 0 && (
                                                    <div
                                                        className="px-4 py-3 text-xs"
                                                        style={{ color: INK_SOFT }}
                                                    >
                                                        No matches
                                                    </div>
                                                )}

                                                {filteredPhoneCodes.map((cc) => (
                                                    <button
                                                        key={cc.code}
                                                        type="button"
                                                        onClick={() => {
                                                            setPhoneCode(cc.code)
                                                            setPhoneCodeOpen(false)
                                                            setPhoneCodeQuery("")
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-black/[0.03]"
                                                        style={{ color: INK }}
                                                    >
                                                        <span>{cc.flag}</span>
                                                        <span className="font-medium">{cc.code}</span>
                                                        <span
                                                            className="text-xs truncate"
                                                            style={{ color: INK_SOFT }}
                                                        >
                                                            {cc.name}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex-1 min-w-0 px-3 py-2.5 text-xs outline-none"
                                        style={{
                                            border: `1px solid ${LINE}`,
                                            color: INK,
                                            background: "transparent"
                                        }}
                                        autoComplete="tel"
                                    />
                                </div>

                            </div>

                            <div className="flex-1 min-w-0 relative">
                                <FieldLabel>PASSWORD</FieldLabel>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min 8 chars, uppercase, digit, special"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    className="w-full px-3 py-2.5 pr-10 text-xs outline-none"
                                    style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[32px] text-sm"
                                    style={{ color: INK_SOFT }}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <FieldLabel>EMAIL ADDRESS</FieldLabel>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="name@email.com"
                                    value={signupEmail}
                                    disabled={emailVerified}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                    className="flex-1 min-w-0 px-4 py-3.5 text-sm outline-none disabled:opacity-40"
                                    style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
                                    autoComplete="email"
                                />
                                <button
                                    type="button"
                                    onClick={showOtpBox ? handleResendOtp : handleSendOtp}
                                    disabled={registerStarting || resending || emailVerified || (!showOtpBox && !captchaToken)}
                                    className="px-4 py-3 sm:py-0 text-xs font-medium shrink-0 border disabled:opacity-40 whitespace-nowrap"
                                    style={{ borderColor: GOLD, color: GOLD_DARK, background: "rgba(201,138,62,0.05)" }}
                                >
                                    {emailVerified ? "Verified ✓" : showOtpBox ? (resending ? "Resending..." : "Resend OTP") : (registerStarting ? "Sending..." : "Send OTP")}
                                </button>
                            </div>
                        </div>

                        {!showOtpBox && (
                            <div className="mb-2">
                                <FieldLabel>VERIFY YOU'RE HUMAN</FieldLabel>
                                <TurnstileWidget
                                    action="register"
                                    resetKey={captchaResetKey}
                                    onVerify={setCaptchaToken}
                                    onExpire={() => setCaptchaToken("")}
                                    onError={(msg) => setErrorMsg(msg)}
                                />
                            </div>
                        )}

                        {showOtpBox && !emailVerified && (
                            <div className="mb-4">
                                <FieldLabel>ENTER OTP</FieldLabel>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="6-digit code"
                                        maxLength={6}
                                        value={otpValue}
                                        onChange={(e) => setOtpValue(e.target.value)}
                                        className="w-full pl-4 pr-28 py-3.5 text-sm outline-none font-mono tracking-wider"
                                        style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
                                        autoComplete="one-time-code"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtpAndProceed}
                                        disabled={!otpValue || verifyingOtp}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-2 text-xs font-medium border disabled:opacity-40 whitespace-nowrap transition-all"
                                        style={{ borderColor: GOLD, color: GOLD_DARK, background: "rgba(201,138,62,0.08)" }}
                                    >
                                        {verifyingOtp ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex items-start sm:items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedTerms}
                                onClick={(e) => {
                                    if (!agreedTerms) {
                                        e.preventDefault()
                                        setShowTermsModal(true)
                                    }
                                }}
                                onChange={(e) => setAgreedTerms(e.target.checked)}
                                className="mt-0.5 sm:mt-0 shrink-0"
                            />
                            <label htmlFor="terms" className="text-xs" style={{ color: INK_SOFT }}>
                                I agree to the{" "}
                                <button type="button" onClick={() => setShowTermsModal(true)} className="underline" style={{ color: GOLD_DARK }}>
                                    Terms and Conditions
                                </button>
                            </label>
                        </div>
                    </fieldset>
                </div>
            )}

            {/* ── STEP: LOCATION ── */}
            {currentStepKey === "location" && (
                <div>
                    <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={locatingUser}
                        className="w-full text-left px-4 py-3.5 text-sm mb-4 disabled:opacity-50"
                        style={{ border: `1px solid ${LINE}`, color: INK }}
                    >
                        {locatingUser ? "📍 Locating..." : "📍 Use Current Location"}
                    </button>

                    <div ref={countryBoxRef} className="relative mb-4">
                        <FieldLabel>COUNTRY</FieldLabel>
                        <input
                            type="text"
                            placeholder="Search country..."
                            value={countryOpen ? countryQuery : country}
                            onFocus={() => {
                                if (fieldsLocked) return

                                setCountryOpen(true)
                                setCountryQuery("")
                            }}
                            onChange={(e) => setCountryQuery(e.target.value)}
                            className="w-full px-4 py-3.5 text-sm outline-none"
                            style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
                        />
                        {countryOpen && (
                            <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto border shadow-lg" style={{ borderColor: LINE, background: SURFACE }}>
                                {filteredCountries.length === 0 && (
                                    <div className="px-4 py-3 text-xs" style={{ color: INK_SOFT }}>No matches</div>
                                )}
                                {filteredCountries.map((c) => (
                                    <button
                                        key={c.isoCode}
                                        type="button"
                                        onClick={() => {
                                            setCountry(c.name)
                                            setCountryOpen(false)
                                            setCountryQuery("")
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-black/[0.03]"
                                        style={{ color: INK }}
                                    >
                                        <span>{c.flag}</span>
                                        <span>{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                            <TextInput label="STATE" placeholder="e.g. Telangana" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <TextInput label="CITY" placeholder="e.g. Hyderabad" value={cityName} onChange={(e) => setCityName(e.target.value)} />
                        </div>
                    </div>
                    <TextAreaInput label="ADDRESS" rows={2} placeholder="Street, area, landmark..." value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
                </div>
            )}

            {/* ── STEP: PROFILE ── */}
            {currentStepKey === "profile" && roleConfig && (
                <div>
                    {profileRows.map((row, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            {row.map((field) => (
                                <div key={field.id} className="flex-1 min-w-0">
                                    {field.type === "textarea" && (
                                        <TextAreaInput
                                            label={field.label}
                                            rows={3}
                                            placeholder={field.placeholder}
                                            value={roleFields[field.id] || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (field.id === "bio" && /\d/.test(val)) {
                                                    setErrorMsg("Bio cannot contain numbers");
                                                    return;
                                                }
                                                if (field.id === "bio") setErrorMsg("");
                                                setRoleField(field.id, val);
                                            }}
                                        />
                                    )}
                                    {(field.type === "text" || field.type === "number") && (
                                        <TextInput label={field.label} type={field.type} placeholder={field.placeholder} value={roleFields[field.id] || ""} onChange={(e) => setRoleField(field.id, e.target.value)} />
                                    )}
                                    {field.type === "select" && (
                                        <SelectInput label={field.label} value={roleFields[field.id] || ""} onChange={(e) => setRoleField(field.id, e.target.value)}>
                                            <option value="">Select {field.label}</option>
                                            {field.options?.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </SelectInput>
                                    )}
                                    {field.type === "category" && (
                                        <SelectInput
                                            label={field.label}
                                            value={roleFields[field.id] || ""}
                                            disabled={isLoadingCategories}
                                            onChange={(e) => {
                                                const catVal = e.target.value;
                                                setRoleFields((prev) => ({
                                                    ...prev,
                                                    category: catVal,
                                                    specialization: "",
                                                }));
                                            }}
                                        >
                                            <option value="">
                                                {isLoadingCategories
                                                    ? "Loading categories from server..."
                                                    : isCategoriesError
                                                    ? "Failed to load categories"
                                                    : categoriesList.length === 0
                                                    ? "No categories available"
                                                    : "Select Category"}
                                            </option>
                                            {categoriesList.map((cat) => (
                                                <option key={cat.id || cat.name} value={cat.name}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    )}
                                    {field.type === "specialization" && (
                                        <SelectInput
                                            label={field.label}
                                            value={roleFields[field.id] || ""}
                                            disabled={!roleFields.category || availableSpecializations.length === 0}
                                            onChange={(e) => setRoleField(field.id, e.target.value)}
                                        >
                                            <option value="">
                                                {!roleFields.category
                                                    ? "Select Category First"
                                                    : availableSpecializations.length === 0
                                                    ? "No specializations available"
                                                    : "Select Specialization"}
                                            </option>
                                            {availableSpecializations.map((spec) => {
                                                const specName = typeof spec === "string" ? spec : spec.name;
                                                const specId = typeof spec === "object" ? spec.id : specName;
                                                return (
                                                    <option key={specId || specName} value={specName}>
                                                        {specName}
                                                    </option>
                                                 );
                                            })}
                                        </SelectInput>
                                    )}
                                    {field.type === "rate" && (
                                        <RateInput
                                            label={field.label}
                                            placeholder={field.placeholder}
                                            currencyData={resolvedCurrency}
                                            value={roleFields[field.id] || ""}
                                            onChange={(e) => setRoleField(field.id, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* ── STEP: REVIEW ── */}
            {currentStepKey === "review" && (
                <div>
                    <div className="mb-5">
                        <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1px" }}>ACCOUNT</div>
                        <div className="text-sm space-y-1 break-words" style={{ color: INK_SOFT }}>
                            <div>{fullName || "—"} · @{username || "—"}</div>
                            <div className="break-all">{signupEmail || "—"}</div>
                            <div>{phoneCode} {phone || "—"}</div>
                            <div>Role: {ROLE_LABELS[role] || role}</div>
                        </div>
                    </div>
                    <div className="h-px my-5" style={{ background: LINE }} />
                    <div className="mb-5">
                        <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1px" }}>LOCATION</div>
                        <div className="text-sm space-y-1 break-words" style={{ color: INK_SOFT }}>
                            <div>{[cityName, stateName, country].filter(Boolean).join(", ") || "—"}</div>
                            {addressLine && <div>{addressLine}</div>}
                        </div>
                    </div>
                    {roleConfig && roleConfig.fields.length > 0 && (
                        <>
                            <div className="h-px my-5" style={{ background: LINE }} />
                            <div className="mb-2">
                                <div className="text-xs font-semibold mb-2" style={{ color: INK, letterSpacing: "1px" }}>PROFILE</div>
                                <div className="text-sm space-y-1 break-words" style={{ color: INK_SOFT }}>
                                    {roleConfig.fields.map((f) => {
                                        let displayVal = roleFields[f.id] || "—"
                                        if (f.id === "rate") {
                                            displayVal = roleFields.rate
                                                ? `${resolvedCurrency?.symbol || "₹"}${roleFields.rate} / hr (${resolvedCurrency?.currency || "INR"})`
                                                : "Not specified (Optional)"
                                        }
                                        return (
                                            <div key={f.id}>{f.label}: {displayVal}</div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── ERROR BANNER — sits right above the nav buttons, i.e. right
                 where the user's eyes already are when they click Next/Back.
                 No scrolling needed because it never renders far from the
                 action that triggered it. ── */}
            {errorMsg && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="mt-6 px-4 py-3 text-xs"
                    style={{ background: ERROR_BG, color: ERROR_TEXT }}
                >
                    {errorMsg}
                </div>
            )}

            {/* ── WIZARD NAV ── */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4">
                {!isFirstStep && (
                    <GhostButton type="button" onClick={handleWizardBack} className="w-full sm:w-auto sm:px-8">
                        Back
                    </GhostButton>
                )}
                <PrimaryButton
                    type="button"
                    onClick={handleWizardNext}
                    disabled={
                        registerStarting ||
                        verifyingOtp ||
                        creatingAccount ||
                        finishingRegister ||
                        (currentStepKey === "account" && (!emailVerified || !otpValue))
                    }
                >
                    {isLastStep ? (finishingRegister ? "Creating Account..." : "Create Account") : "Next"}
                </PrimaryButton>
            </div>

            <div className="text-center mt-6 text-sm" style={{ color: INK_SOFT }}>
                Already have an account?{" "}
                <button type="button" onClick={onSwitchToLogin} className="underline" style={{ color: INK }}>
                    Sign In
                </button>
            </div>

            {showTermsModal && (
                <TermsModal agreedTerms={agreedTerms} onAgree={handleAgreeTerms} onClose={() => setShowTermsModal(false)} />
            )}
        </div>
    )
}