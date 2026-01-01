import { useEffect, useRef } from 'react'
import '../styles/background.css'

type BackgroundProps = {
    url?: string;
};

const Background = ({ url }: BackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener("resize", resize);

        if (url) {
            const img = new Image();
            img.src = url;

            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };

            return () => {
                window.removeEventListener("resize", resize);
            };
        }

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = "rgba(0,255,255,0.8)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function calcCount() {
            return Math.max(20, Math.floor((canvas.width * canvas.height) / 15000));
        }

        let particles: Particle[] = [];

        function recreateParticles() {
            const COUNT = calcCount();
            particles = Array.from({ length: COUNT }, () => new Particle());
        }

        recreateParticles();

        let animationFrame: number;

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const COUNT = particles.length;

            ctx.strokeStyle = "rgba(0,255,255,0.25)";
            ctx.lineWidth = 1;

            for (let i = 0; i < COUNT; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < COUNT; j++) {
                    const p2 = particles[j];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = dx * dx + dy * dy;

                    if (dist < 150 * 150) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrame = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resize);
        };
    }, []);


    return <canvas ref={canvasRef} id="background-canvas" />;
}

export default Background;
