import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  nameRu: string;
  radius: number; // km
  distance: number; // million km from Sun
  orbitalPeriod: number; // Earth days
  color: string;
  orbitRadius: number; // pixels for display
  displaySize: number; // pixels for display
  description: string;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    radius: 2439,
    distance: 57.9,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    orbitRadius: 60,
    displaySize: 4,
    description: 'Самая маленькая и ближайшая к Солнцу планета.'
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    radius: 6051,
    distance: 108.2,
    orbitalPeriod: 225,
    color: '#e8cda0',
    orbitRadius: 95,
    displaySize: 7,
    description: 'Самая горячая планета с плотной атмосферой из CO₂.'
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    radius: 6371,
    distance: 149.6,
    orbitalPeriod: 365,
    color: '#4da6ff',
    orbitRadius: 130,
    displaySize: 8,
    description: 'Наш дом — единственная известная планета с жизнью.'
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    radius: 3389,
    distance: 227.9,
    orbitalPeriod: 687,
    color: '#e07040',
    orbitRadius: 170,
    displaySize: 6,
    description: 'Красная планета с самой высокой горой — Олимп.'
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    radius: 69911,
    distance: 778.5,
    orbitalPeriod: 4333,
    color: '#d4a574',
    orbitRadius: 225,
    displaySize: 18,
    description: 'Крупнейшая планета с Большим Красным Пятном.'
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    radius: 58232,
    distance: 1434,
    orbitalPeriod: 10759,
    color: '#f4d59c',
    orbitRadius: 285,
    displaySize: 15,
    description: 'Знаменита своей системой колец из льда и камня.'
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    radius: 25362,
    distance: 2871,
    orbitalPeriod: 30687,
    color: '#7de8e8',
    orbitRadius: 340,
    displaySize: 11,
    description: 'Ледяной гигант, вращающийся «на боку».'
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    radius: 24622,
    distance: 4495,
    orbitalPeriod: 60190,
    color: '#4466ff',
    orbitRadius: 390,
    displaySize: 10,
    description: 'Самая далёкая планета с сильнейшими ветрами.'
  }
];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const planetAnglesRef = useRef<number[]>(planets.map(() => Math.random() * Math.PI * 2));

  const getCenter = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 400, y: 400 };
    return { x: canvas.width / 2, y: canvas.height / 2 };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const center = getCenter();

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 200; i++) {
      const x = (Math.sin(i * 567.89) * 0.5 + 0.5) * canvas.width;
      const y = (Math.cos(i * 123.45) * 0.5 + 0.5) * canvas.height;
      const size = (Math.sin(i * 45.67) * 0.5 + 0.5) * 1.5 + 0.5;
      ctx.globalAlpha = 0.3 + Math.sin(timeRef.current * 0.001 + i) * 0.2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Draw Sun with glow
    const sunGradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 40);
    sunGradient.addColorStop(0, '#fff7a0');
    sunGradient.addColorStop(0.3, '#ffdd44');
    sunGradient.addColorStop(0.7, '#ff9900');
    sunGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 40, 0, Math.PI * 2);
    ctx.fill();

    // Sun core
    const sunCore = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 25);
    sunCore.addColorStop(0, '#ffffff');
    sunCore.addColorStop(0.5, '#ffee88');
    sunCore.addColorStop(1, '#ffaa00');
    ctx.fillStyle = sunCore;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Draw orbits and planets
    planets.forEach((planet, index) => {
      // Orbit path
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center.x, center.y, planet.orbitRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Planet position
      const angle = planetAnglesRef.current[index];
      const px = center.x + Math.cos(angle) * planet.orbitRadius;
      const py = center.y + Math.sin(angle) * planet.orbitRadius;

      // Planet glow
      const glowGradient = ctx.createRadialGradient(px, py, 0, px, py, planet.displaySize * 2);
      glowGradient.addColorStop(0, planet.color);
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(px, py, planet.displaySize * 2, 0, Math.PI * 2);
      ctx.fill();

      // Planet body
      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.arc(px, py, planet.displaySize, 0, Math.PI * 2);
      ctx.fill();

      // Saturn rings
      if (planet.name === 'Saturn') {
        ctx.strokeStyle = 'rgba(244, 213, 156, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(px, py, planet.displaySize * 2, planet.displaySize * 0.5, 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Hover effect
      if (hoveredPlanet === planet.name) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, planet.displaySize + 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Selected effect
      if (selectedPlanet?.name === planet.name) {
        ctx.strokeStyle = '#00ffaa';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(px, py, planet.displaySize + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Planet label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(planet.nameRu, px, py - planet.displaySize - 8);
    });
  }, [getCenter, hoveredPlanet, selectedPlanet]);

  const animate = useCallback(() => {
    if (isPlaying) {
      timeRef.current += speed;
      planets.forEach((planet, index) => {
        const angularSpeed = (Math.PI * 2) / (planet.orbitalPeriod * 2);
        planetAnglesRef.current[index] += angularSpeed * speed * 0.05;
      });
    }
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const center = getCenter();

    for (const planet of planets) {
      const index = planets.indexOf(planet);
      const angle = planetAnglesRef.current[index];
      const px = center.x + Math.cos(angle) * planet.orbitRadius;
      const py = center.y + Math.sin(angle) * planet.orbitRadius;

      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.displaySize + 10) {
        setSelectedPlanet(planet);
        return;
      }
    }
    setSelectedPlanet(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const center = getCenter();

    let found = false;
    for (const planet of planets) {
      const index = planets.indexOf(planet);
      const angle = planetAnglesRef.current[index];
      const px = center.x + Math.cos(angle) * planet.orbitRadius;
      const py = center.y + Math.sin(angle) * planet.orbitRadius;

      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.displaySize + 10) {
        setHoveredPlanet(planet.name);
        canvas.style.cursor = 'pointer';
        found = true;
        break;
      }
    }
    if (!found) {
      setHoveredPlanet(null);
      canvas.style.cursor = 'default';
    }
  };

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-gradient-to-r from-[#0d1b2a] to-[#1b2838] border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌞</span>
            <h1 className="text-white text-xl font-bold tracking-wide">
              Солнечная Система
            </h1>
          </div>
          <p className="text-white/50 text-sm hidden sm:block">
            Нажмите на планету для подробной информации
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="w-full h-full block"
          />
        </div>

        {/* Info Panel */}
        {selectedPlanet && (
          <div className="absolute top-4 right-4 w-80 bg-[#1a1a2e]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 text-white animate-fade-in">
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full shadow-lg"
                style={{
                  backgroundColor: selectedPlanet.color,
                  boxShadow: `0 0 20px ${selectedPlanet.color}40`
                }}
              />
              <div>
                <h2 className="text-2xl font-bold">{selectedPlanet.nameRu}</h2>
                <p className="text-white/50 text-sm">{selectedPlanet.name}</p>
              </div>
            </div>

            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              {selectedPlanet.description}
            </p>

            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/50 text-xs uppercase tracking-wider mb-1">
                  Радиус
                </div>
                <div className="text-lg font-semibold">
                  {selectedPlanet.radius.toLocaleString()} км
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/50 text-xs uppercase tracking-wider mb-1">
                  Расстояние от Солнца
                </div>
                <div className="text-lg font-semibold">
                  {selectedPlanet.distance.toLocaleString()} млн км
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/50 text-xs uppercase tracking-wider mb-1">
                  Орбитальный период
                </div>
                <div className="text-lg font-semibold">
                  {selectedPlanet.orbitalPeriod.toLocaleString()} дней
                  {selectedPlanet.orbitalPeriod > 365 && (
                    <span className="text-white/50 text-sm ml-2">
                      ({(selectedPlanet.orbitalPeriod / 365.25).toFixed(1)} лет)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Planet list sidebar */}
        <div className="absolute bottom-20 left-4 flex flex-col gap-1">
          {planets.map((planet) => (
            <button
              key={planet.name}
              onClick={() => setSelectedPlanet(planet)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-sm transition-all ${
                selectedPlanet?.name === planet.name
                  ? 'bg-white/15 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: planet.color }}
              />
              <span>{planet.nameRu}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 bg-gradient-to-r from-[#0d1b2a] to-[#1b2838] border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-center gap-6 max-w-2xl mx-auto">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
            title={isPlaying ? 'Пауза' : 'Воспроизвести'}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2l10 6-10 6V2z" />
              </svg>
            )}
          </button>

          {/* Speed control */}
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-sm">Скорость:</span>
            <div className="flex gap-1">
              {[0.25, 0.5, 1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    speed === s
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              planetAnglesRef.current = planets.map(() => Math.random() * Math.PI * 2);
              timeRef.current = 0;
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
            title="Сбросить позиции"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 8a6 6 0 0 1 10.5-4M14 8a6 6 0 0 1-10.5 4" />
              <path d="M12.5 1v3h-3M3.5 15v-3h3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
