
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Placeholder tech icons (will be replaced with actual PNGs/SVGs later)
const techIcons = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Node', color: '#339933' },
  { name: 'JS', color: '#F7DF1E' },
  { name: 'TS', color: '#3178C6' },
  { name: 'CSS', color: '#1572B6' },
  { name: 'HTML', color: '#E34F26' },
  { name: 'Git', color: '#F05032' },
  { name: 'API', color: '#FF6B6B' },
  { name: 'DB', color: '#4DB33D' },
  { name: 'AWS', color: '#FF9900' }
];

// Matter.js Plinko Physics Engine
class PlinkoEngine {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    
    // Initialize all properties first
    this.world = null;
    this.engine = null;
    this.runner = null;
    this.balls = [];
    this.pegs = [];
    this.barriers = [];
    this.gate = null;
    this.gateBody = null; // Initialize gateBody here
    this.gateOpen = false;
    this.animationId = null;
    
    // Only initialize physics if dimensions are valid
    if (width > 0 && height > 0) {
      this.initPhysics();
    }
  }

  initPhysics() {
    // Create Matter.js engine and world
    const Matter = window.Matter || this.loadMatter();
    if (!Matter) {
      // Initialize without Matter.js if it's not available
      this.initWithoutMatter();
      return;
    }

    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    
    // Configure engine
    this.engine.world.gravity.y = 0.3; // Gentle gravity
    this.engine.world.gravity.scale = 0.001;

    // Create boundaries (invisible walls)
    const walls = [
      // Left wall
      Matter.Bodies.rectangle(-25, this.height/2, 50, this.height, { isStatic: true }),
      // Right wall  
      Matter.Bodies.rectangle(this.width + 25, this.height/2, 50, this.height, { isStatic: true }),
      // Bottom floor
      Matter.Bodies.rectangle(this.width/2, this.height + 25, this.width, 50, { isStatic: true })
    ];
    
    Matter.World.add(this.world, walls);
    
    this.createPegs();
    this.createBottomBarriers();
    this.createGate();
    this.createBalls();
    
    // Start physics simulation
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
  }

  initWithoutMatter() {
    // For demo purposes - in real implementation, Matter.js should be loaded via script tag
    console.warn('Matter.js not found - using simplified physics simulation');
    // Initialize basic components without Matter.js
    this.createPegs();
    this.createBottomBarriers();
    this.createGate();
    this.createBalls();
  }

  loadMatter() {
    // Placeholder for loading Matter.js
    return null;
  }

  createPegs() {
    // Classic Plinko pattern - 7 rows as requested
    const pegRadius = 8;
    const rows = 7;
    const startY = this.height * 0.25;
    const endY = this.height * 0.75;
    const verticalRowSpacing = (endY - startY) / (rows - 1); // Renamed to avoid conflict with rowSpacing inside loop
    
    // Calculate spacing based on the widest row (row 7 has 9 pegs)
    const maxPegs = 3 + (rows - 1); // Row 0 has 3, each row adds 1
    const baseHorizontalSpacing = this.width * 0.8 / (maxPegs - 1); // 80% of width for pegs
    
    for (let row = 0; row < rows; row++) {
      const y = startY + row * verticalRowSpacing;
      const pegsInRow = 3 + row; // Row 0 = 3 pegs, Row 1 = 4 pegs, etc.
      const isEvenRow = row % 2 === 0;
      
      // Calculate horizontal spacing for this specific row to distribute pegs evenly
      const currentRowSpacing = this.width * 0.8 / (pegsInRow - 1);
      
      // Calculate initial offset for centering the row
      const rowWidth = (pegsInRow - 1) * currentRowSpacing;
      const rowStartX = (this.width - rowWidth) / 2;
      
      // Calculate stagger offset for alternating rows
      // We want to effectively shift every other row by half the widest peg spacing.
      const staggerOffset = isEvenRow ? 0 : baseHorizontalSpacing / 2;
      
      for (let peg = 0; peg < pegsInRow; peg++) {
        // Center the row of pegs and apply stagger
        const x = rowStartX + peg * currentRowSpacing + staggerOffset;
        
        this.pegs.push({
          x, y, radius: pegRadius,
          color: '#00FF41', // DOS green
          glow: Math.random() * Math.PI * 2
        });
        
        // Add to physics world if Matter.js available
        if (window.Matter && this.world) {
          try {
            const pegBody = window.Matter.Bodies.circle(x, y, pegRadius, { 
              isStatic: true,
              restitution: 0.8,
              friction: 0.3
            });
            window.Matter.World.add(this.world, pegBody);
          } catch (error) {
            console.warn('Failed to add peg to Matter.js world:', error);
          }
        }
      }
    }
  }

  createBottomBarriers() {
    const barrierSize = 60;
    const barrierY = this.height - barrierSize/2 - 20;
    
    // Left barrier
    this.barriers.push({
      x: barrierSize/2 + 40,
      y: barrierY,
      width: barrierSize,
      height: barrierSize,
      color: '#00FF41'
    });
    
    // Right barrier  
    this.barriers.push({
      x: this.width - barrierSize/2 - 40,
      y: barrierY,
      width: barrierSize,
      height: barrierSize,
      color: '#00FF41'
    });
    
    // Add to physics world
    if (window.Matter && this.world) {
      try {
        const leftBarrier = window.Matter.Bodies.rectangle(
          this.barriers[0].x, this.barriers[0].y, barrierSize, barrierSize, 
          { isStatic: true, restitution: 0.4 }
        );
        const rightBarrier = window.Matter.Bodies.rectangle(
          this.barriers[1].x, this.barriers[1].y, barrierSize, barrierSize,
          { isStatic: true, restitution: 0.4 }
        );
        window.Matter.World.add(this.world, [leftBarrier, rightBarrier]);
      } catch (error) {
        console.warn('Failed to add barriers to Matter.js world:', error);
      }
    }
  }

  createGate() {
    // Ensure dimensions are valid
    if (!this.width || !this.height || this.width <= 0 || this.height <= 0) {
      console.warn('Invalid dimensions for gate creation, skipping gate creation.');
      return;
    }

    const gateY = this.height * 0.15;
    const gateWidth = this.width * 0.6;
    const gateX = this.width/2;
    
    this.gate = {
      x: gateX,
      y: gateY,
      width: gateWidth,
      height: 8,
      isOpen: false
    };
    
    // Add to physics world if available
    if (window.Matter && this.world) {
      try {
        this.gateBody = window.Matter.Bodies.rectangle(gateX, gateY, gateWidth, 8, {
          isStatic: true,
          render: { fillStyle: '#FF0000' }
        });
        window.Matter.World.add(this.world, this.gateBody);
      } catch (error) {
        console.warn('Failed to add gate to Matter.js world:', error);
      }
    }
  }

  createBalls() {
    const ballRadius = 20;
    const spacing = (this.width * 0.8) / techIcons.length;
    const startX = this.width * 0.1;
    const ballY = this.height * 0.08;
    
    techIcons.forEach((tech, i) => {
      const ball = {
        x: startX + i * spacing,
        y: ballY,
        radius: ballRadius,
        tech: tech,
        body: null,
        settled: false
      };
      
      // Add to physics world
      if (window.Matter && this.world) {
        try {
          ball.body = window.Matter.Bodies.circle(ball.x, ball.y, ballRadius, {
            restitution: 0.6,
            friction: 0.4,
            density: 0.001
          });
          window.Matter.World.add(this.world, ball.body);
        } catch (error) {
          console.warn('Failed to add ball to Matter.js world:', error);
        }
      }
      
      this.balls.push(ball);
    });
  }

  openGate() {
    if (!this.gate) {
      console.warn('Gate not initialized, cannot open.');
      return;
    }
    
    if (this.gateOpen) return;
    
    this.gateOpen = true;
    this.gate.isOpen = true;
    
    // Remove gate from physics world
    if (window.Matter && this.gateBody && this.world) {
      try {
        window.Matter.World.remove(this.world, this.gateBody);
      } catch (error) {
        console.warn('Failed to remove gate from Matter.js world:', error);
      }
    }
  }

  reset() {
    this.gateOpen = false;
    
    // Reset gate state
    if (this.gate) {
      this.gate.isOpen = false;
    }
    
    // Remove existing gate body from world before recreating
    if (window.Matter && this.gateBody && this.world) {
      try {
        window.Matter.World.remove(this.world, this.gateBody);
      } catch (error) {
        console.warn('Failed to remove gate body during reset:', error);
      }
      this.gateBody = null; // Clear the reference
    }

    // Reset ball positions
    this.balls.forEach((ball, i) => {
      const spacing = (this.width * 0.8) / techIcons.length;
      const startX = this.width * 0.1;
      const ballY = this.height * 0.08;
      
      ball.x = startX + i * spacing;
      ball.y = ballY;
      ball.settled = false;
      
      if (ball.body && window.Matter) {
        try {
          window.Matter.Body.setPosition(ball.body, { x: ball.x, y: ball.y });
          window.Matter.Body.setVelocity(ball.body, { x: 0, y: 0 });
          window.Matter.Body.setAngularVelocity(ball.body, 0); // Reset angular velocity too
        } catch (error) {
          console.warn('Failed to reset ball position/velocity:', error);
        }
      }
    });
    
    // Recreate gate
    this.createGate();
  }

  update() {
    // Update ball positions from physics bodies
    if (window.Matter) {
      this.balls.forEach(ball => {
        if (ball.body) {
          ball.x = ball.body.position.x;
          ball.y = ball.body.position.y;
        }
      });
    } else {
      // Fallback simple physics
      this.balls.forEach(ball => {
        if (this.gateOpen && !ball.settled) {
          ball.y += 2;
          if (ball.y > this.height - 100) {
            ball.settled = true;
          }
        }
      });
    }
    
    // Update peg glow animation
    this.pegs.forEach(peg => {
      peg.glow += 0.02;
    });
  }

  render() {
    // Clear canvas with dark background
    this.ctx.fillStyle = '#0A0A0A';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw pegs
    this.pegs.forEach(peg => {
      const glowIntensity = Math.sin(peg.glow) * 0.3 + 0.7;
      this.ctx.beginPath();
      this.ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 255, 65, ${glowIntensity})`;
      this.ctx.fill();
      
      // Glow effect
      this.ctx.shadowColor = '#00FF41';
      this.ctx.shadowBlur = 10;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    });
    
    // Draw barriers
    this.barriers.forEach(barrier => {
      this.ctx.fillStyle = '#00FF41';
      this.ctx.fillRect(
        barrier.x - barrier.width/2,
        barrier.y - barrier.height/2,
        barrier.width,
        barrier.height
      );
      
      // Outline
      this.ctx.strokeStyle = '#00AA33';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        barrier.x - barrier.width/2,
        barrier.y - barrier.height/2,
        barrier.width,
        barrier.height
      );
    });
    
    // Draw gate (if exists and closed)
    if (this.gate && !this.gate.isOpen) {
      this.ctx.fillStyle = '#FF0033';
      this.ctx.fillRect(
        this.gate.x - this.gate.width/2,
        this.gate.y - this.gate.height/2,
        this.gate.width,
        this.gate.height
      );
    }
    
    // Draw balls/tech icons
    this.balls.forEach(ball => {
      // Ball circle
      this.ctx.beginPath();
      this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = ball.tech.color + 'AA';
      this.ctx.fill();
      
      // Border
      this.ctx.strokeStyle = '#00FF41';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Text
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 12px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(ball.tech.name, ball.x, ball.y);
    });
    
    // DOS-style scanlines effect
    for (let i = 0; i < this.height; i += 4) {
      this.ctx.fillStyle = 'rgba(0, 255, 65, 0.02)';
      this.ctx.fillRect(0, i, this.width, 1);
    }
  }

  animate = () => {
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(this.animate);
  }

  start() {
    this.animate();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null; // Clear animation ID
    }
    if (window.Matter && this.runner) {
      try {
        window.Matter.Runner.stop(this.runner);
        // Clear engine and world if they exist
        if (this.engine) {
          window.Matter.Engine.clear(this.engine);
          this.engine.world = null;
          this.engine = null;
        }
      } catch (error) {
        console.warn('Failed to stop Matter.js runner or clear engine:', error);
      }
      this.runner = null; // Clear runner reference
    }
    
    // Clean up references
    this.gate = null;
    this.gateBody = null;
    this.balls = [];
    this.pegs = [];
    this.barriers = [];
    this.ctx = null; // Clear canvas context
    this.canvas = null; // Clear canvas reference
  }
}

export default function TechStackPhysics() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const container = canvas.parentElement;
      const newWidth = container.offsetWidth;
      const newHeight = 700;

      // Only reinitialize if dimensions change or engine isn't created yet
      if (!engineRef.current || canvas.width !== newWidth || canvas.height !== newHeight) {
        if (engineRef.current) {
          engineRef.current.destroy();
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;

        engineRef.current = new PlinkoEngine(canvas, canvas.width, canvas.height);
        engineRef.current.start();
        setIsLoaded(true);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  const handleDropIcons = () => {
    if (engineRef.current && !gateOpen) {
      engineRef.current.openGate();
      setGateOpen(true);
    }
  };

  const handleReset = () => {
    if (engineRef.current) {
      engineRef.current.reset();
      setGateOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-6 bg-black/80 backdrop-blur-sm border border-green-500/20 rounded-xl px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-green-400">PLINKO ENGINE</span>
          </div>
          
          <button
            onClick={handleDropIcons}
            disabled={gateOpen}
            className={`px-6 py-2 font-mono text-sm transition-all duration-300 ${
              gateOpen 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-green-400 hover:text-black hover:bg-green-400'
            }`}
          >
            {gateOpen ? '[ RELEASED ]' : '[ DROP ICONS ]'}
          </button>
          
          <button
            onClick={handleReset}
            className="px-6 py-2 font-mono text-sm text-yellow-400 hover:text-black hover:bg-yellow-400 transition-all duration-300"
          >
            [ RESET ]
          </button>
        </div>
      </motion.div>

      {/* Plinko Canvas */}
      <div className="relative bg-black border-2 border-green-500/30 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ background: 'transparent' }}
        />
        
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-green-400 font-mono text-sm">LOADING PHYSICS ENGINE...</p>
            </div>
          </div>
        )}

        {/* DOS-style corner brackets */}
        <div className="absolute top-2 left-2 text-green-500/50 font-mono text-xs">┌─</div>
        <div className="absolute top-2 right-2 text-green-500/50 font-mono text-xs">─┐</div>
        <div className="absolute bottom-2 left-2 text-green-500/50 font-mono text-xs">└─</div>
        <div className="absolute bottom-2 right-2 text-green-500/50 font-mono text-xs">─┘</div>
        
        {/* Status display */}
        <div className="absolute top-4 right-4 text-green-400/70 font-mono text-xs">
          <div>GATE: {gateOpen ? 'OPEN' : 'CLOSED'}</div>
          <div>ICONS: {techIcons.length}</div>
        </div>
      </div>

      {/* Game Info */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center bg-black/50 border border-green-500/20 rounded-lg p-4">
          <div className="text-green-400 font-mono text-2xl font-bold">{techIcons.length}</div>
          <div className="text-green-400/70 font-mono text-xs">TECH ICONS</div>
        </div>
        <div className="text-center bg-black/50 border border-green-500/20 rounded-lg p-4">
          <div className="text-green-400 font-mono text-2xl font-bold">42</div>
          <div className="text-green-400/70 font-mono text-xs">PLINKO PEGS</div>
        </div>
        <div className="text-center bg-black/50 border border-green-500/20 rounded-lg p-4">
          <div className="text-green-400 font-mono text-2xl font-bold">∞</div>
          <div className="text-green-400/70 font-mono text-xs">REPLAY VALUE</div>
        </div>
      </div>
    </div>
  );
}
