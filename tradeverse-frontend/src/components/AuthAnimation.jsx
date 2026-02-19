import { useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function AuthAnimation() {
  const canvasRef = useRef(null);
  const { dark } = useContext(ThemeContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    let width, height;

    // Configuration based on theme
    const themeConfig = {
      particleColors: dark ? ["#3b82f6", "#8b5cf6"] : ["#2563eb", "#0284c7"], // Dark: Blue/Purple, Light: Blue/Sky
      lineColor: dark ? "rgba(100, 116, 139," : "rgba(30, 41, 59,", // Dark: Slate/400, Light: Slate/800
      glow: dark // Only glow in dark mode
    };

    // Mouse interaction
    const mouse = { x: null, y: null, radius: 150 };

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? themeConfig.particleColors[0] : themeConfig.particleColors[1];
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        // Glow effect
        if (themeConfig.glow) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
        } else {
          ctx.shadowBlur = 0;
        }
      }

      update() {
        // Normal movement
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse Interaction (Repel/Attract)
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
          } else {
            // Return to base speed if pushed too far
            if (this.x !== this.baseX) {
              let dx = this.x - this.baseX;
              this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
              let dy = this.y - this.baseY;
              this.y -= dy / 10;
            }
          }
        }

        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (width * height) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Connections
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `${themeConfig.lineColor} ${1 - distance / 120})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
        particles[a].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      // Adjust for canvas position relative to window
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    // Resize initially
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dark]);

  return (
    <div className="auth-animation-container">
      <style>{`
        .auth-animation-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary); 
          /* Subtle radial gradient for depth */
          background-image: ${dark
          ? 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.05) 0%, transparent 50%)'};
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }

        canvas {
            width: 100%;
            height: 100%;
            display: block;
        }
        
        .overlay-text {
            position: absolute;
            bottom: 10%;
            left: 10%;
            color: var(--text-primary);
            z-index: 10;
            pointer-events: none;
        }
        
        .overlay-text h2 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
      `}</style>

      <canvas ref={canvasRef} />

      <div className="overlay-text animate-fade-in">
        <h2>Trade the Future</h2>
        <p style={{ maxWidth: '300px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          Experience the next generation of financial intelligence with TradeVerse.
        </p>
      </div>
    </div>
  );
}
