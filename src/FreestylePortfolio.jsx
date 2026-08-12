import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

// Portfolio categories with Freestyle-style positioning and flavor variants
const categories = [
  {
    id: 1,
    name: "Web Apps",
    icon: "🌐",
    color: "#F40009",
    bgColor: "#F40009",
    position: { x: "15%", y: "12%" },
    variants: [
      { name: "React", icon: "⚛️", offset: { x: -80, y: -60 } },
      { name: "Next.js", icon: "▲", offset: { x: 80, y: -60 } },
      { name: "Full Stack", icon: "🔧", offset: { x: 0, y: -90 } },
    ],
  },
  {
    id: 2,
    name: "UI/UX",
    icon: "🎨",
    color: "#FFCC00",
    bgColor: "#FFCC00",
    position: { x: "50%", y: "8%" },
    variants: [
      { name: "Figma", icon: "🎯", offset: { x: -70, y: -50 } },
      { name: "Design Systems", icon: "📐", offset: { x: 70, y: -50 } },
    ],
  },
  {
    id: 3,
    name: "Mobile",
    icon: "📱",
    color: "#00A3E0",
    bgColor: "#00A3E0",
    position: { x: "8%", y: "45%" },
    variants: [
      { name: "iOS", icon: "🍎", offset: { x: -75, y: 0 } },
      { name: "Android", icon: "🤖", offset: { x: -75, y: 70 } },
      { name: "Blue Milk", icon: "🥛", offset: { x: 0, y: 85 } },
    ],
  },
  {
    id: 4,
    name: "Animation",
    icon: "✨",
    color: "#FF6B35",
    bgColor: "#FF6B35",
    position: { x: "88%", y: "15%" },
    variants: [
      { name: "Framer Motion", icon: "🎬", offset: { x: 80, y: -60 } },
      { name: "GSAP", icon: "⚡", offset: { x: 80, y: 10 } },
    ],
  },
  {
    id: 5,
    name: "Graphics",
    icon: "🎭",
    color: "#6B4C9A",
    bgColor: "#6B4C9A",
    position: { x: "32%", y: "35%" },
    variants: [
      { name: "Illustrations", icon: "✏️", offset: { x: -70, y: 60 } },
      { name: "Icons", icon: "🔷", offset: { x: 0, y: 80 } },
    ],
  },
  {
    id: 6,
    name: "Branding",
    icon: "🏆",
    color: "#00B140",
    bgColor: "#00B140",
    position: { x: "75%", y: "40%" },
    variants: [
      { name: "Logos", icon: "💎", offset: { x: 70, y: 60 } },
      { name: "Style Guides", icon: "📚", offset: { x: 80, y: 0 } },
    ],
  },
  {
    id: 7,
    name: "3D Design",
    icon: "🎲",
    color: "#E94196",
    bgColor: "#E94196",
    position: { x: "90%", y: "65%" },
    variants: [
      { name: "Blender", icon: "🌀", offset: { x: 75, y: 70 } },
      { name: "Three.js", icon: "🔮", offset: { x: 0, y: 85 } },
    ],
  },
  {
    id: 8,
    name: "Code",
    icon: "💻",
    color: "#1A1A1A",
    bgColor: "#1A1A1A",
    position: { x: "55%", y: "60%" },
    variants: [
      { name: "TypeScript", icon: "📘", offset: { x: -70, y: 70 } },
      { name: "Python", icon: "🐍", offset: { x: 70, y: 70 } },
    ],
  },
];

// Sample project data
const projectData = {
  1: {
    title: "Web Apps",
    description: "Full-stack applications built with modern frameworks",
    projects: ["E-commerce Platform", "SaaS Dashboard", "Real-time Chat"],
  },
  2: {
    title: "UI/UX Design",
    description: "Beautiful, user-centered interface designs",
    projects: ["Banking App Redesign", "Travel Booking Flow", "Design System"],
  },
  3: {
    title: "Mobile Development",
    description: "Native and cross-platform mobile experiences",
    projects: ["Fitness Tracker", "Food Delivery App", "Social Media Client"],
  },
  4: {
    title: "Animation",
    description: "Motion design and interactive animations",
    projects: ["Brand Animations", "Loading Sequences", "Micro-interactions"],
  },
  5: {
    title: "Graphics",
    description: "Visual design and digital illustrations",
    projects: ["Marketing Materials", "Social Media Graphics", "Icon Sets"],
  },
  6: {
    title: "Branding",
    description: "Complete brand identity systems",
    projects: ["Startup Branding", "Rebranding Campaign", "Logo Design"],
  },
  7: {
    title: "3D Design",
    description: "3D modeling and rendering projects",
    projects: ["Product Visualizations", "3D Icons", "Environment Design"],
  },
  8: {
    title: "Code Projects",
    description: "Open source and experimental code",
    projects: ["React Components", "Animation Library", "CLI Tools"],
  },
};

// Utility function to calculate polar coordinates
const polarToCartesian = (angle, radius, centerX, centerY) => {
  const angleInRadians = ((angle - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const FreestylePortfolio = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(null); // Category selected for dispense screen
  const [holdingDispense, setHoldingDispense] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showingProject, setShowingProject] = useState(null); // Project overlay being shown
  const [isMobile, setIsMobile] = useState(false);
  const [showDispenseScreen, setShowDispenseScreen] = useState(false); // New screen state
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCategoryClick = (categoryId) => {
    // Clicking a bubble selects it
    setActiveCategoryId(categoryId);
    setProgress(0);
  };

  const handleDispenseClick = () => {
    // Clicking dispense button when category is selected goes to dispense screen
    if (activeCategoryId) {
      setShowDispenseScreen(true);
    }
  };

  const handleBackToMenu = () => {
    setShowDispenseScreen(false);
    setActiveCategoryId(null);
    setProgress(0);
  };

  const handleDispenseMouseDown = () => {
    if (!activeCategoryId) return;

    setHoldingDispense(true);
    setProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current);
          handlePourComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  };

  const handleDispenseMouseUp = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setHoldingDispense(false);
    setProgress(0);
  };

  const handlePourComplete = () => {
    setShowingProject(activeCategoryId);
    setHoldingDispense(false);
    setProgress(0);
  };

  const handleClose = () => {
    setShowingProject(null);
    setActiveCategoryId(null);
  };

  const CategoryButton = ({ category }) => {
    const isActive = activeCategoryId === category.id;

    return (
      <div
        className="absolute"
        style={{
          left: category.position.x,
          top: category.position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Main Category Button */}
        <motion.button
          onClick={() => handleCategoryClick(category.id)}
          className="relative"
        >
          <motion.div
            className="w-30 h-30 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center text-4xl md:text-5xl cursor-pointer relative overflow-hidden"
            style={{
              background: category.bgColor,
              border: `3px solid ${
                isActive ? category.color : "rgba(255, 255, 255, 0.9)"
              }`,
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 6px 25px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              opacity: isActive ? 0.5 : 1,
              boxShadow: isActive
                ? `0 0 25px ${category.color}80, 0 4px 15px rgba(0, 0, 0, 0.3)`
                : "0 4px 15px rgba(0, 0, 0, 0.2)",
            }}
          >
            {!isActive && (
              <>
                <div className="mb-1">{category.icon}</div>
                {/* Horizontal divider line */}
                <div 
                  className="w-16 md:w-20 h-0.5 my-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                  }}
                />
                {/* Label inside bubble with contrasting color */}
                <div 
                  className="text-[10px] md:text-xs font-bold tracking-tight px-2 text-center leading-tight"
                  style={{
                    color: category.bgColor === '#FFCC00' || category.bgColor === '#00A3E0' ? '#000' : '#FFF',
                    textShadow: category.bgColor === '#FFCC00' || category.bgColor === '#00A3E0' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {category.name}
                </div>
              </>
            )}
          </motion.div>
        </motion.button>

        {/* Flavor Variant Buttons (non-functional) */}
        {category.variants.map((variant, index) => (
          <motion.div
            key={index}
            className="absolute w-21 h-21 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center text-2xl md:text-3xl cursor-not-allowed opacity-60 overflow-hidden"
            style={{
              background: category.bgColor,
              border: "2px solid rgba(255, 255, 255, 0.7)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
              left: `${variant.offset.x}px`,
              top: `${variant.offset.y}px`,
              filter: "brightness(0.9)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="mb-0.5">{variant.icon}</div>
            {/* Horizontal divider line */}
            <div 
              className="w-10 md:w-12 h-0.5 my-0.5"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
              }}
            />
            {/* Variant label inside bubble */}
            <div 
              className="text-[8px] md:text-[10px] font-bold tracking-tight px-1 text-center leading-tight"
              style={{
                color: category.bgColor === '#FFCC00' || category.bgColor === '#00A3E0' ? '#000' : '#FFF',
                textShadow: category.bgColor === '#FFCC00' || category.bgColor === '#00A3E0' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {variant.name}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const DispenseButton = () => {
    const activeCategory = activeCategoryId
      ? categories.find((cat) => cat.id === activeCategoryId)
      : null;
    const isDisabled = !activeCategoryId;

    return (
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-28 h-28 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center cursor-pointer z-50"
        style={{
          background: isDisabled
            ? "linear-gradient(135deg, #999, #777)"
            : "linear-gradient(135deg, #F40009, #C80007)",
          border: "4px solid white",
          boxShadow: "0 6px 25px rgba(0, 0, 0, 0.25)",
        }}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        animate={
          !isDisabled
            ? {
                boxShadow: [
                  "0 6px 25px rgba(0, 0, 0, 0.25)",
                  "0 8px 30px rgba(0, 0, 0, 0.3)",
                  "0 6px 25px rgba(0, 0, 0, 0.25)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
        onClick={handleDispenseClick}
        onMouseDown={() => {}}
        onMouseUp={() => {}}
        onMouseLeave={() => {}}
        onTouchStart={() => {}}
        onTouchEnd={() => {}}
      >
        {/* Active category icon */}
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory.id}
              className="text-3xl md:text-4xl mb-1"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {activeCategory.icon}
            </motion.div>
          )}
          {!activeCategory && (
            <motion.div
              className="text-3xl md:text-4xl mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              🥤
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-white text-xs md:text-sm font-bold tracking-wider">
          {activeCategory ? "HOLD" : "SELECT"}
        </div>

        {/* Progress Ring */}
        {holdingDispense && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            style={{ overflow: "visible" }}
          >
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray={`${progress * 3.14} 314`}
              style={{
                filter: "drop-shadow(0 0 8px white)",
                transition: "stroke-dasharray 0.02s linear",
              }}
            />
          </svg>
        )}
      </motion.div>
    );
  };

  const DispenseScreen = ({ categoryId }) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return null;

    const mixInOptions = [
      { name: 'Regular', color: category.bgColor },
      { name: 'Zero Sugar', color: category.bgColor },
      { name: 'Light', color: category.bgColor },
      { name: 'Cherry', color: '#8B0000' },
      { name: 'Vanilla', color: '#F3E5AB' },
      { name: 'Lime', color: '#32CD32' },
    ];

    return (
      <motion.div
        className="fixed inset-0 z-40 bg-gradient-to-br from-gray-50 to-gray-100"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Back Button */}
        <motion.button
          className="absolute top-6 left-6 px-6 py-2 rounded-full bg-white border-2 border-gray-300 text-gray-700 font-bold text-sm shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToMenu}
        >
          ← Start Over
        </motion.button>

        {/* Back to Facts Button */}
        <motion.button
          className="absolute top-6 right-6 px-6 py-2 rounded-full bg-white border-2 border-gray-300 text-gray-700 font-bold text-sm shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Facts
        </motion.button>

        <div className="h-full flex flex-col items-center justify-start pt-24 pb-40">
          {/* Selected Drink Display */}
          <motion.div
            className="w-48 h-48 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center mb-8"
            style={{
              background: category.bgColor,
              border: '4px solid white',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <div className="text-7xl md:text-8xl mb-3">{category.icon}</div>
            <div 
              className="w-24 md:w-32 h-0.5 my-2"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
              }}
            />
            <div 
              className="text-lg md:text-xl font-bold px-4 text-center"
              style={{
                color: category.bgColor === '#FFCC00' || category.bgColor === '#00A3E0' ? '#000' : '#FFF',
                textShadow: category.bgColor === '#FFCC00' || category.bgColor === '#00A3E0' ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {category.name}
            </div>
          </motion.div>

          {/* Nutrition Information Box */}
          <motion.div
            className="w-80 h-48 md:w-96 md:h-56 rounded-2xl bg-white border-2 border-gray-300 shadow-lg mb-8 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Project Details</h3>
            <p className="text-gray-600 text-sm mb-3">{projectData[categoryId]?.description}</p>
            <div className="text-xs text-gray-500">
              Featured: {projectData[categoryId]?.projects.slice(0, 2).join(', ')}
            </div>
          </motion.div>

          {/* Mix-In Options */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-center text-gray-700 font-semibold mb-4 text-sm md:text-base">
              Want to mix it up? Try these adding these drinks to {category.name}.
            </p>
            <p className="text-center text-gray-600 font-medium mb-6 text-xs md:text-sm">
              Showing Low Calorie options.
            </p>

            {/* Mix-in bubbles */}
            <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap max-w-2xl">
              {mixInOptions.map((option, index) => (
                <motion.div
                  key={index}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center cursor-pointer"
                  style={{
                    background: option.color,
                    border: '2px solid white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-[8px] md:text-[10px] font-bold text-white text-center px-1">
                    {option.name}
                  </span>
                </motion.div>
              ))}
              
              {/* Arrow for more options */}
              <motion.div
                className="w-10 h-10 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <span className="text-2xl text-gray-400">→</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Press and Hold Dispense Button */}
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-700 font-bold mb-3 text-sm md:text-base">
            {holdingDispense ? 'Pouring...' : 'Press and Hold'}
          </p>
          
          <motion.button
            className="w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, #F40009, #C80007)',
              border: '4px solid white',
              boxShadow: '0 6px 25px rgba(0, 0, 0, 0.25)',
            }}
            whileTap={{ scale: 0.98 }}
            onMouseDown={handleDispenseMouseDown}
            onMouseUp={handleDispenseMouseUp}
            onMouseLeave={handleDispenseMouseUp}
            onTouchStart={handleDispenseMouseDown}
            onTouchEnd={handleDispenseMouseUp}
          >
            <div className="text-white font-bold text-sm">PUSH</div>
            
            {/* Progress Ring */}
            {holdingDispense && (
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                style={{ overflow: 'visible' }}
              >
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeDasharray={`${progress * 3.14} 314`}
                  style={{
                    filter: 'drop-shadow(0 0 8px white)',
                    transition: 'stroke-dasharray 0.02s linear',
                  }}
                />
              </svg>
            )}
          </motion.button>

          {/* Arrow indicator */}
          <motion.div
            className="mt-4 text-gray-400"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-2xl">↓</span>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  const ProjectOverlay = ({ categoryId }) => {
    const project = projectData[categoryId];

    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0, 0, 0, 0.95)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        {/* Splash Effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(circle, rgba(244, 0, 9, 0.6) 0%, transparent 70%)",
          }}
        />

        {/* Content Card */}
        <motion.div
          className="relative max-w-2xl w-full rounded-3xl p-8 md:p-12"
          style={{
            background: "rgba(20, 20, 20, 0.95)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(244, 0, 9, 0.5)",
            boxShadow:
              "0 0 60px rgba(244, 0, 9, 0.4), inset 0 0 40px rgba(244, 0, 9, 0.1)",
          }}
          initial={{ scale: 0.8, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 100 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
            style={{
              background: "rgba(244, 0, 9, 0.8)",
              boxShadow: "0 0 20px rgba(244, 0, 9, 0.5)",
            }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
          >
            ×
          </motion.button>

          {/* Content */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: "#F40009",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {project.title}
          </motion.h2>

          <motion.p
            className="text-gray-300 text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {project.description}
          </motion.p>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Featured Projects
            </h3>
            {project.projects.map((proj, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(244, 0, 9, 0.1)",
                  border: "1px solid rgba(244, 0, 9, 0.3)",
                  boxShadow: "0 0 15px rgba(244, 0, 9, 0.2)",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 25px rgba(244, 0, 9, 0.4)",
                }}
              >
                <p className="text-white font-medium">{proj}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bubbles Effect */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: "rgba(244, 0, 9, 0.6)",
                left: `${20 + i * 15}%`,
                bottom: "10%",
              }}
              animate={{
                y: [-20, -300],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
      }}
    >
      {/* Main Selection Screen */}
      {!showDispenseScreen && (
        <>
          {/* Background Grid Effect */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Subtle Glow Orbs */}
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(244, 0, 9, 0.08) 0%, transparent 70%)",
              filter: "blur(60px)",
              top: "10%",
              right: "10%",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0, 163, 224, 0.08) 0%, transparent 70%)",
              filter: "blur(60px)",
              bottom: "10%",
              left: "10%",
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.7, 0.5, 0.7],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Main Content Container */}
          <div className="relative w-full h-screen pb-48">
            {/* Category Buttons */}
            {categories.map((category) => (
              <CategoryButton key={category.id} category={category} />
            ))}
          </div>

          {/* Instructions */}
          <motion.div
            className="fixed bottom-44 left-1/2 -translate-x-1/2 text-center z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-700 text-sm md:text-base font-bold">
              {activeCategoryId ? 'Click DISPENSE to Continue' : 'Click a Category to Select'}
            </p>
          </motion.div>

          {/* Dispense Button - Fixed at Bottom */}
          <DispenseButton />
        </>
      )}

      {/* Dispense Screen */}
      <AnimatePresence>
        {showDispenseScreen && activeCategoryId && (
          <DispenseScreen categoryId={activeCategoryId} />
        )}
      </AnimatePresence>

      {/* Project Overlay */}
      <AnimatePresence>
        {showingProject && <ProjectOverlay categoryId={showingProject} />}
      </AnimatePresence>
    </div>
  );
};

export default FreestylePortfolio;
