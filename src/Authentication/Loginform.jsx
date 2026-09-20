import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useToast } from "../utils/toast"
import {
  useLoginMutation,
  useForgotStartMutation,
  useForgotVerifyOtpMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
} from "../Authentication/authApiSlice"
import {
  INK, INK_SOFT, GOLD, GOLD_DARK, LINE, SURFACE, ERROR_BG, ERROR_TEXT,
  FieldLabel, TextInput, PrimaryButton, GhostButton, getErrMsg,
  TurnstileWidget,
} from "./authShared"

/* ────────────────────────────────────────────────────────────────
   FORGOT PASSWORD MODAL — only ever mounted from the login screen
──────────────────────────────────────────────────────────────── */
function ForgotPasswordModal({ onClose }) {
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotStep, setForgotStep] = useState("email") // email -> otp -> reset
  const [forgotOtp, setForgotOtp] = useState("")
  const [forgotSessionToken, setForgotSessionToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // ── Turnstile captcha (forgotStart requires captchaToken) ──
  const [captchaToken, setCaptchaToken] = useState("")
  const [captchaResetKey, setCaptchaResetKey] = useState(0)
  const resetCaptcha = () => {
    setCaptchaToken("")
    setCaptchaResetKey((k) => k + 1)
  }

  const [forgotStart, { isLoading: sendingForgotOtp }] = useForgotStartMutation()
  const [forgotVerifyOtp, { isLoading: verifyingForgotOtp }] = useForgotVerifyOtpMutation()
  const [resendOtp, { isLoading: resendingForgotOtp }] = useResendOtpMutation()
  const [resetPassword] = useResetPasswordMutation()
  const toast = useToast()

  const handleForgotSendOtp = async () => {
    setErrorMsg("")
    if (!forgotEmail) return setErrorMsg("Please enter your email")
    if (!captchaToken) return setErrorMsg("Please complete the captcha")
    try {
      const res = await forgotStart({ email: forgotEmail.toLowerCase(), captchaToken }).unwrap()
      setForgotSessionToken(res.data.forgotSessionToken)
      setForgotStep("otp")
      setCountdown(60)
      toast.success("OTP sent to your email")
    } catch (err) {
      setErrorMsg(getErrMsg(err))
    } finally {
      resetCaptcha()
    }
  }

  const handleForgotResendOtp = async () => {
    setErrorMsg("")
    try {
      await resendOtp({ forgotSessionToken }).unwrap()
      toast.success("New OTP sent to your email")
      setCountdown(60)
    } catch (err) {
      setErrorMsg(getErrMsg(err))
    }
  }

  const handleForgotVerifyOtp = async () => {
    setErrorMsg("")
    if (!forgotOtp) return setErrorMsg("Please enter the OTP")
    try {
      const res = await forgotVerifyOtp({ forgotSessionToken, otp: forgotOtp }).unwrap()
      setForgotSessionToken(res.data.forgotSessionToken)
      setForgotStep("reset")
      toast.success("OTP verified")
    } catch (err) {
      setErrorMsg(getErrMsg(err))
    }
  }

  const handleResetPassword = async () => {
    setErrorMsg("")
    if (!newPassword || !confirmPassword) return setErrorMsg("Please enter and confirm your new password")
    if (newPassword !== confirmPassword) return setErrorMsg("Passwords do not match")
    try {
      await resetPassword({ forgotSessionToken, newPassword }).unwrap()
      toast.success("Password reset successfully")
      onClose()
    } catch (err) {
      setErrorMsg(getErrMsg(err))
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md"
      style={{
        background: "rgba(31,35,64,0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 99999,
      }}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-8 rounded-sm shadow-2xl"
        style={{ background: SURFACE, boxShadow: "0 20px 60px rgba(0,0,0,0.45)", zIndex: 100000 }}
      >
        <button onClick={onClose} className="absolute right-5 top-5 text-lg hover:opacity-75" style={{ color: INK_SOFT }}>✕</button>

        <h3 className="text-xl sm:text-2xl mb-1 pr-6" style={{ fontFamily: "Georgia, serif", color: INK }}>Reset Password</h3>
        <p className="text-xs mb-6" style={{ color: INK_SOFT }}>
          {forgotStep === "email" && "Enter your email address to receive an OTP."}
          {forgotStep === "otp" && "Enter the OTP sent to your email."}
          {forgotStep === "reset" && "Choose a new password."}
        </p>

        {errorMsg && (
          <div className="mb-4 px-4 py-2 text-xs" style={{ background: ERROR_BG, color: ERROR_TEXT }}>{errorMsg}</div>
        )}

        {forgotStep === "email" && (
          <>
            <TextInput label="EMAIL ADDRESS" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} autoComplete="username" />
            <div className="mb-2">
              <FieldLabel>VERIFY YOU'RE HUMAN</FieldLabel>
              <TurnstileWidget
                action="forgot_password"
                resetKey={captchaResetKey}
                onVerify={setCaptchaToken}
                onExpire={() => setCaptchaToken("")}
                onError={(msg) => setErrorMsg(msg)}
              />
            </div>
          </>
        )}

        {forgotStep === "otp" && (
          <div className="mb-4">
            <FieldLabel>ENTER OTP</FieldLabel>
            <div className="flex flex-col gap-2">
              <TextInput
                placeholder="6-digit code"
                maxLength={6}
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                autoComplete="one-time-code"
              />
              <div className="flex items-center justify-between mt-1 text-xs">
                <span style={{ color: INK_SOFT }}>Didn't receive the code?</span>
                <button
                  type="button"
                  onClick={handleForgotResendOtp}
                  disabled={resendingForgotOtp || countdown > 0}
                  className="font-medium underline disabled:opacity-50 disabled:no-underline"
                  style={{ color: GOLD_DARK }}
                >
                  {resendingForgotOtp
                    ? "Resending..."
                    : countdown > 0
                    ? `Resend in ${countdown}s`
                    : "Resend OTP"}
                </button>
              </div>
            </div>
          </div>
        )}

        {forgotStep === "reset" && (
          <>
            <TextInput label="NEW PASSWORD" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
            <TextInput label="CONFIRM PASSWORD" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
          </>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
          <GhostButton type="button" onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton
            type="button"
            disabled={
              forgotStep === "email"
                ? sendingForgotOtp || !captchaToken
                : forgotStep === "otp"
                ? verifyingForgotOtp || !forgotOtp
                : false
            }
            onClick={() => {
              if (forgotStep === "email") handleForgotSendOtp()
              else if (forgotStep === "otp") handleForgotVerifyOtp()
              else if (forgotStep === "reset") handleResetPassword()
            }}
          >
            {forgotStep === "email" && (sendingForgotOtp ? "Sending..." : "Send OTP")}
            {forgotStep === "otp" && (verifyingForgotOtp ? "Verifying..." : "Verify OTP")}
            {forgotStep === "reset" && "Reset Password"}
          </PrimaryButton>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ────────────────────────────────────────────────────────────────
   LOGIN FORM
──────────────────────────────────────────────────────────────── */
export default function LoginForm({ onSwitchToSignUp }) {
  const navigate = useNavigate()
  const toast = useToast()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // ── Turnstile captcha (login requires captchaToken) ──
  const [captchaToken, setCaptchaToken] = useState("")
  const [captchaResetKey, setCaptchaResetKey] = useState(0)
  const resetCaptcha = () => {
    setCaptchaToken("")
    setCaptchaResetKey((k) => k + 1)
  }

  const [login, { isLoading: loggingIn }] = useLoginMutation()

  const handleSignIn = async () => {
    setErrorMsg("")
    if (!captchaToken) return setErrorMsg("Please complete the captcha")
    try {
      const res = await login({
        email: loginEmail.toLowerCase(),
        password: loginPassword,
        captchaToken,
      }).unwrap()
      Cookies.set("token", res.data.token, { expires: 7 })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userData", JSON.stringify(res.data))
      toast.success("Signed in successfully")
      navigate("/dashboard")
    } catch (err) {
      setErrorMsg(getErrMsg(err))
    } finally {
      resetCaptcha()
    }
  }

  return (
    <div
      className="w-full max-w-full p-5 sm:p-8 md:p-14 relative sm:w-[440px] md:w-[490px]"
      style={{ background: SURFACE, boxShadow: "0 2px 18px rgba(0,0,0,0.08)", zIndex: 1 }}
    >
      <h2 className="text-2xl sm:text-3xl mb-2" style={{ fontFamily: "Georgia, serif", color: INK }}>
        Sign In to Night Owl Designers
      </h2>
      <p className="mb-6 sm:mb-7 text-sm sm:text-base" style={{ color: INK_SOFT }}>
        Welcome back — let's get you home.
      </p>

      {errorMsg && (
        <div className="mb-5 px-4 py-3 text-xs" style={{ background: ERROR_BG, color: ERROR_TEXT }}>
          {errorMsg}
        </div>
      )}

      <form
        autoComplete="on"
        onSubmit={(e) => {
          e.preventDefault()
          if (!loggingIn) handleSignIn()
        }}
      >
        <TextInput
          label="EMAIL ADDRESS"
          type="email"
          name="username"
          autoComplete="username"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <div className="mb-2 relative">
          <FieldLabel>PASSWORD</FieldLabel>
          <input
            type={showPassword ? "text" : "password"}
            name="current-password"
            autoComplete="current-password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full px-4 py-3.5 pr-12 text-sm outline-none"
            style={{ border: `1px solid ${LINE}`, color: INK, background: "transparent" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[38px]"
            style={{ color: INK_SOFT }}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <div className="text-right mb-6">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-xs underline"
            style={{ color: GOLD_DARK }}
          >
            Forgot password?
          </button>
        </div>

        {/* ── Turnstile captcha — required by the login endpoint ── */}
        <div className="mb-5">
          <FieldLabel>VERIFY YOU'RE HUMAN</FieldLabel>
          <TurnstileWidget
            action="login"
            resetKey={captchaResetKey}
            onVerify={setCaptchaToken}
            onExpire={() => setCaptchaToken("")}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>

        <PrimaryButton type="submit" disabled={loggingIn || !captchaToken}>
          {loggingIn ? "Signing In..." : "Sign In"}
        </PrimaryButton>

        <div className="flex items-center gap-4 my-7">
          <div className="h-px flex-1" style={{ background: LINE }} />
          <span className="text-[10px] tracking-widest uppercase" style={{ color: INK_SOFT }}>or</span>
          <div className="h-px flex-1" style={{ background: LINE }} />
        </div>

        {/* <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3.5 text-sm border"
          style={{ borderColor: LINE, color: INK }}
        >
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <g>
              <path d="m0 0H512V512H0" fill="#fff" />
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
            </g>
          </svg>
          Continue with Google
        </button> */}

        <div className="text-center mt-6 text-sm" style={{ color: INK_SOFT }}>
          New to NOD?{" "}
          <button type="button" onClick={onSwitchToSignUp} className="underline" style={{ color: INK }}>
            Sign Up
          </button>
        </div>
      </form>

      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
    </div>
  )
}


