import { useState } from "react";
import { registerUser, googleLogin } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import AuthAnimation from "../components/AuthAnimation";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await registerUser({ name, email, password });
            if (res.message === "User registered successfully") {
                navigate("/login");
            } else {
                setError(res.message || "Registration failed");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const res = await googleLogin(credentialResponse.credential);
            if (res.token) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(res.user));
                navigate("/dashboard");
            } else {
                setError(res.message || "Google Sign Up failed");
            }
        } catch {
            setError("Google Sign Up Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <style>{`
            .login-page {
              min-height: 100vh;
              width: 100%;
              display: grid;
              grid-template-columns: 1fr 1fr;
              background: var(--bg-primary);
              overflow: hidden;
            }
    
            .animation-side {
              position: relative;
              background: var(--bg-secondary);
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            
            .form-side {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 2rem;
              background: var(--bg-primary);
              color: var(--text-primary);
            }
    
            .form-container {
                width: 100%;
                max-width: 420px;
            }
    
            .input-group {
              margin-bottom: 1.5rem;
            }
    
            .input-label {
                display: block;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
                color: var(--text-secondary);
            }
    
            .input-field {
              width: 100%;
              padding: 14px 16px;
              background: var(--glass-bg);
              border: var(--glass-border);
              border-radius: 12px;
              color: var(--text-primary);
              font-size: 1rem;
              outline: none;
              transition: all 0.2s;
              box-sizing: border-box;
            }
    
            .input-field:focus {
              border-color: var(--success); /* Green focus for signup */
              background: rgba(255, 255, 255, 0.08);
              box-shadow: 0 0 0 3px var(--success-glow);
            }
    
            .btn-primary {
                background: var(--success);
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.1s;
                border-radius: 12px;
                padding: 14px;
                font-size: 1rem;
                border: none;
            }
            
            .btn-primary:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }
    
            .btn-primary:active {
                transform: translateY(0);
            }
    
            .logo-header {
              text-align: left;
              margin-bottom: 3rem;
            }
            
            .logo-header h1 {
              font-size: 2rem;
              margin-bottom: 0.5rem;
              display: flex;
              align-items: center;
              gap: 10px;
              color: var(--text-primary);
            }
            
            .logo-header p {
              color: var(--text-secondary);
              margin: 0;
            }
    
            .divider {
                display: flex;
                align-items: center;
                margin: 2rem 0;
                color: var(--text-secondary);
                font-size: 0.85rem;
            }
            .divider::before, .divider::after {
                content: '';
                flex: 1;
                height: 1px;
                background: rgba(255,255,255,0.1);
            }
            .divider span {
                padding: 0 10px;
            }
    
            @media (max-width: 900px) {
                .login-page {
                    grid-template-columns: 1fr;
                }
                .animation-side {
                    display: none;
                }
            }
          `}</style>

            {/* Left Side - Animation */}
            <div className="animation-side">
                <AuthAnimation />
            </div>

            {/* Right Side - Form */}
            <div className="form-side">
                <div className="form-container animate-fade-in">
                    <div className="logo-header">
                        <h1>
                            <span style={{ fontSize: "2.5rem" }}>🚀</span>
                            Join TradeVerse
                        </h1>
                        <p>Start your trading journey today.</p>
                    </div>

                    {error && (
                        <div style={{ color: "var(--danger)", marginBottom: "1.5rem", padding: "10px", background: "var(--danger-glow)", borderRadius: "8px", fontSize: "0.9rem" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <input
                                className="input-field"
                                placeholder="John Doe"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                className="input-field"
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    className="input-field"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "var(--text-secondary)",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "4px"
                                    }}
                                >
                                    {showPassword ? "👁️" : "🙈"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: "100%" }}
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                setError("Google Sign Up Failed");
                            }}
                            theme="filled_black"
                            shape="rectangular"
                            width="100%"
                            text="signup_with"
                        />
                    </div>

                    <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                        Already have an account? <Link to="/login" style={{ color: "var(--success)", fontWeight: "600", textDecoration: "none" }}>Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
