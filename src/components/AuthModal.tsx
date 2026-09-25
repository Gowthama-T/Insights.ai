import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const { currentUser, userProfile, loginWithGoogle, loginWithEmail, register, logout } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [email, setEmail] = useState('alex.chen@globalretail.corp');
  const [password, setPassword] = useState('SecurePass1234!');
  const [fullName, setFullName] = useState('Alex Chen');
  const [jobRole, setJobRole] = useState('VP of Analytics / Business Lead');
  const [companyName, setCompanyName] = useState('Global Retail Corp');
  const [cloudRegion, setCloudRegion] = useState('US East (N. Virginia • AWS GovCloud Ready)');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === 'signin') {
        setStatusMessage('Verifying credentials with Firebase Auth...');
        await loginWithEmail(email, password);
      } else {
        setStatusMessage('Creating enterprise user in Firebase & Firestore...');
        await register(email, password, fullName, {
          jobRole,
          companyName,
          cloudRegion,
        });
      }
      setStatusMessage('Authenticated successfully!');
      setTimeout(() => {
        setIsSubmitting(false);
        setStatusMessage(null);
        onClose();
      }, 500);
    } catch (err: any) {
      setIsSubmitting(false);
      setStatusMessage(null);
      // Clean up common Firebase error codes for clear UX
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid corporate credentials. If this is your first time, choose "Create Account" or "Continue with Google Workspace".');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists. Please switch to "Sign In" tab.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Password must be at least 6 characters long.');
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage('Connecting to Google Identity Services...');
    try {
      await loginWithGoogle();
      setStatusMessage('Signed in with Google!');
      setTimeout(() => {
        setIsSubmitting(false);
        setStatusMessage(null);
        onClose();
      }, 500);
    } catch (err: any) {
      setIsSubmitting(false);
      setStatusMessage(null);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Google Sign-In was cancelled.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Sign-In popup was blocked by browser. Please allow popups.');
      } else {
        setErrorMessage(err.message || 'Failed to authenticate with Google.');
      }
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      await logout();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface/90 backdrop-blur-md flex flex-col justify-start animate-in fade-in duration-200">
      {/* Top Bar matching header design */}
      <header className="sticky top-0 w-full z-40 bg-surface/90 backdrop-blur-xl border-b border-surface-container/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
        <div className="max-w-xl mx-auto h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 -ml-1 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container transition-colors active:scale-95"
              type="button"
              aria-label="Navigate back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <img
              alt="InsightAI Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1V8PcEqKSBG3eDqo9j0NMUMPpF6hIi2k05MZaJvW-7eefxRT1yLLuKD3Vw7PV5Bs4PybehNO1riAJx9wyFKd2mu1XvxoijXMvCAl9CgbnF5w2nxeptb1uvICqScZQ-zcnj4FvKF55LM9Jgcgf1EfMaDnBDxVgL1sZKXONG212XX1e4OljqWHweuuDtBkGdlwinF6izCzyFasDRsYMh16yhzxnxc5-LoVTFCQzTC34Z4aXwf546OLaES9eKZ"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-on-surface tracking-tight leading-none">
                InsightAI
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-tertiary text-[12px]">verified_user</span>
                <span className="font-mono uppercase tracking-wider text-[10px] text-on-surface-variant">
                  SOC2 Type II • Firebase Auth
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => alert('Support Desk: support@insightai.enterprise (Available 24/7)')}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              title="Help & Support"
            >
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col w-full max-w-xl mx-auto px-4 py-4 gap-4 pb-12">
        {/* If Already Logged In */}
        {currentUser && (
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container/60 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-primary-fixed"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center text-lg font-bold">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-bold text-on-surface truncate">
                    {currentUser.displayName || userProfile?.displayName || 'Enterprise User'}
                  </h2>
                  <span className="px-2 py-0.2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant truncate font-mono mt-0.5">
                  {currentUser.email}
                </p>
                <span className="text-[11px] text-secondary font-medium mt-0.5">
                  {userProfile?.jobRole || 'VP of Analytics'} • {userProfile?.companyName || 'Global Retail Corp'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex flex-col gap-1 border border-surface-container/60">
              <div className="flex justify-between">
                <span className="font-semibold text-on-surface">Cloud Data Residency:</span>
                <span>{userProfile?.cloudRegion || 'US East (N. Virginia)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-on-surface">Firebase Auth Provider:</span>
                <span className="font-mono">{currentUser.providerData[0]?.providerId || 'password'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-on-surface">Data Isolation:</span>
                <span className="text-tertiary font-bold">AES-256 KMS Enforced</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-xs hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
              >
                Return to Workspace
              </button>
              <button
                onClick={handleSignOut}
                disabled={isSubmitting}
                className="px-4 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-error text-xs font-semibold active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* If Not Logged In */}
        {!currentUser && (
          <>
            {/* Subtle decorative ambient intelligence glow */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-surface-container-low shadow-sm border border-surface-container/60 p-4">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

              {/* Badge */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                  <span className="font-semibold text-[11px] tracking-wide">
                    {mode === 'signin'
                      ? 'Enterprise AI Intelligence Platform'
                      : '14-Day Enterprise Trial • No Credit Card Required'}
                  </span>
                </div>
              </div>

              {/* Headlines */}
              <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight mb-1">
                {mode === 'signin'
                  ? 'Turn your business data into decisions.'
                  : 'Start Turning Data Into Decisions'}
              </h1>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {mode === 'signin'
                  ? 'Connect your data and let AI build meaningful analytics for you.'
                  : 'Deploy your AI-powered analytics engine in under 3 minutes.'}
              </p>

              {/* Interactive Mode Switcher */}
              <div className="mt-3 p-1 bg-surface-container-high rounded-xl flex items-center shadow-inner">
                <button
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                    mode === 'signin'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                    mode === 'register'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">domain_add</span>
                  <span>Create Account</span>
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs flex items-start gap-2 border border-error/20 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Main Authentication Form Card */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container/60 p-4 flex flex-col gap-3.5">
              {/* SSO Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold rounded-xl flex items-center justify-between transition-all active:scale-[0.99] border border-surface-container/60 cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-xs">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>
                    <span>
                      {mode === 'signin' ? 'Continue with Google Workspace' : 'Sign up with Google Workspace'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    chevron_right
                  </span>
                </button>

                <button
                  onClick={() => handleGoogleSignIn()}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold rounded-xl flex items-center justify-between transition-all active:scale-[0.99] border border-surface-container/60 cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-xs">
                      <svg className="w-3 h-3" viewBox="0 0 21 21">
                        <rect fill="#F25022" height="9" width="9" x="1" y="1" />
                        <rect fill="#7FBA00" height="9" width="9" x="11" y="1" />
                        <rect fill="#00A4EF" height="9" width="9" x="11" y="1" />
                        <rect fill="#FFB900" height="9" width="9" x="11" y="11" />
                      </svg>
                    </div>
                    <span>
                      {mode === 'signin' ? 'Continue with Microsoft Entra ID' : 'Sign up with Microsoft Entra ID'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    chevron_right
                  </span>
                </button>

                {mode === 'signin' && (
                  <button
                    onClick={() => handleGoogleSignIn()}
                    className="w-full min-h-[44px] px-3.5 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold rounded-xl flex items-center justify-between transition-all active:scale-[0.99] border border-surface-container/60 cursor-pointer"
                    type="button"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
                        <span className="material-symbols-outlined text-[15px]">vpn_key</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>Continue with Okta / SAML SSO</span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant text-[9px] font-bold">
                          IDP
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      chevron_right
                    </span>
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-0.5">
                <div className="w-full h-px bg-surface-container-high" />
                <span className="absolute left-1/2 -translate-x-1/2 bg-surface-container-lowest px-2.5 text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  {mode === 'signin' ? 'or continue with enterprise email' : 'or register with corporate credentials'}
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {mode === 'register' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Full Name */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase text-on-surface-variant flex justify-between">
                          <span>Full Name</span>
                          <span className="text-primary font-medium lowercase">required</span>
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                            badge
                          </span>
                          <input
                            className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low text-xs border border-surface-container/80 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Job Role */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase text-on-surface-variant">Job Role</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                            work
                          </span>
                          <select
                            className="w-full h-10 pl-9 pr-7 rounded-xl bg-surface-container-low text-xs border border-surface-container/80 text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                          >
                            <option>VP of Analytics / Business Lead</option>
                            <option>Chief Data Officer (CDO)</option>
                            <option>Enterprise Architect</option>
                            <option>Principal Data Scientist</option>
                            <option>Financial Analyst</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold uppercase text-on-surface-variant">Company Name</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                          corporate_fare
                        </span>
                        <input
                          className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low text-xs border border-surface-container/80 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary-fixed/50 text-on-secondary-fixed-variant self-start mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">domain_verification</span>
                        <span className="text-[10px] font-semibold">
                          Detected tenant: <span className="font-mono">globalretail.corp</span>
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase text-on-surface-variant flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>Work Email Address</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </span>
                    <span className="text-[10px] text-tertiary font-semibold">Corporate Match</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                      alternate_email
                    </span>
                    <input
                      className="w-full h-11 pl-9 pr-9 bg-surface-container-low text-xs text-on-surface rounded-xl border border-surface-container/80 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase text-on-surface-variant">Password</label>
                    {mode === 'signin' ? (
                      <button
                        type="button"
                        onClick={() => alert('Password recovery link sent to your corporate SSO inbox.')}
                        className="text-[11px] text-primary hover:underline font-semibold"
                      >
                        Forgot password?
                      </button>
                    ) : (
                      <span className="text-[11px] text-tertiary font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                        Strong
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                      lock
                    </span>
                    <input
                      className="w-full h-11 pl-9 pr-10 bg-surface-container-low text-xs text-on-surface rounded-xl border border-surface-container/80 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono tracking-widest"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>

                  {mode === 'register' && (
                    <>
                      {/* Strength Bar */}
                      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden flex gap-1 mt-1">
                        <div className="flex-1 bg-tertiary rounded-full" />
                        <div className="flex-1 bg-tertiary rounded-full" />
                        <div className="flex-1 bg-tertiary rounded-full" />
                        <div className="flex-1 bg-tertiary rounded-full" />
                      </div>
                      {/* Checklist */}
                      <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-tertiary font-semibold">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          <span>12+ chars</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          <span>Symbol & num</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          <span>SSO compliant</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {mode === 'register' && (
                  /* Cloud Region */
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase text-on-surface-variant flex justify-between">
                      <span>Data Residency & Region</span>
                      <span className="text-[10px] text-tertiary font-medium lowercase flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">lock</span> isolated tenant
                      </span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                        dns
                      </span>
                      <select
                        className="w-full h-10 pl-9 pr-7 rounded-xl bg-surface-container-low text-xs border border-surface-container/80 text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={cloudRegion}
                        onChange={(e) => setCloudRegion(e.target.value)}
                      >
                        <option>US East (N. Virginia • AWS GovCloud Ready)</option>
                        <option>EU Central (Frankfurt • GDPR Compliant)</option>
                        <option>AP Southeast (Singapore • ISO/IEC 27001)</option>
                        <option>US West (Oregon • Low Carbon Region)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                )}

                {/* Checkboxes */}
                {mode === 'signin' ? (
                  <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={() => setRememberDevice(!rememberDevice)}
                        className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                      />
                      <span className="text-on-surface-variant text-[11px]">Remember this device (30 days)</span>
                    </label>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">fingerprint</span>
                      <span>Passkey / Biometric Ready</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 pt-1 text-xs">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={() => setAgreedTerms(!agreedTerms)}
                      className="mt-0.5 w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                      required
                    />
                    <label className="text-[11px] text-on-surface-variant leading-relaxed">
                      I agree to the <span className="text-primary font-semibold underline">Terms of Service</span>, <span className="text-primary font-semibold underline">Enterprise DPA</span>, and <span className="text-primary font-semibold underline">Privacy Notice</span>.
                    </label>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 mt-1 bg-gradient-to-r from-primary to-primary-container text-on-primary text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isSubmitting ? 'animate-spin' : ''}`}>
                    {isSubmitting ? 'progress_activity' : 'arrow_forward'}
                  </span>
                  <span>
                    {statusMessage
                      ? statusMessage
                      : mode === 'signin'
                      ? 'Sign In to Workspace'
                      : 'Create Enterprise Account'}
                  </span>
                </button>
              </form>

              {mode === 'register' && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container text-on-surface-variant text-[11px]">
                  <div className="w-7 h-7 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">database</span>
                  </div>
                  <p>
                    <strong className="text-on-surface font-bold">Next step:</strong> Connect your first data source (PostgreSQL, Snowflake, BigQuery, or Excel).
                  </p>
                </div>
              )}
            </div>

            {/* Realtime workspace info */}
            <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0">
                <span className="material-symbols-outlined text-[20px]">insights</span>
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  <p className="font-bold text-on-surface truncate">Global Retail Corp Instance Online</p>
                </div>
                <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                  39 AI pipelines active • 14.8M records synced
                </p>
              </div>
            </div>

            {/* Trust & Compliance Card */}
            {mode === 'register' ? (
              <div className="rounded-2xl p-4 bg-surface-container-low border border-surface-container/60 shadow-xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">shield_lock</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-on-surface">Enterprise-Grade Security & Privacy</span>
                    <span className="px-2 py-0.2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase">
                      Zero-Retention
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
                    We strictly enforce zero-model-training on customer telemetry. Your analytical schemas remain read-only, fully isolated, and cryptographically signed within your selected cloud region.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center pt-1">
                <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 text-on-surface-variant text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-tertiary text-[14px]">verified</span>
                    <span>SOC-2 Type II Certified</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[14px]">lock</span>
                    <span>256-bit AES Encryption</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[14px]">shield_person</span>
                    <span>SSO / SAML 2.0 Ready</span>
                  </div>
                </div>
                <p className="text-[10px] text-on-surface-variant/80 max-w-sm">
                  By signing in, you agree to our Master Services Agreement and Enterprise Privacy Policy.
                </p>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-2 py-3 border-t border-surface-container/60 flex flex-col items-center justify-center gap-1.5 text-center text-xs text-on-surface-variant">
              <div className="flex items-center gap-1 text-[11px]">
                <span className="material-symbols-outlined text-tertiary text-[14px]">lock</span>
                <span>TLS 1.3 Encrypted • SAML 2.0 / Okta Ready</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-primary transition-colors">Enterprise SSO</a>
              </div>
              <p className="text-[10px] text-outline mt-0.5">
                © 2025 InsightAI Systems Inc. All rights reserved.
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};
