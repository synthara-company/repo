import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const CursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [trailPositions, setTrailPositions] = useState<{ x: number; y: number; id: number }[]>([]);
  const [trailCount, setTrailCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Skip on mobile devices
    if (isMobile) return;

    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });

      // Add new position to trail with a unique ID
      setTrailCount(prev => prev + 1);
      setTrailPositions(prev => [
        { x: e.clientX, y: e.clientY, id: trailCount },
        ...prev.slice(0, 15) // Keep only the last 15 positions
      ]);
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, [trailCount, isMobile]);

  useEffect(() => {
    // Skip on mobile devices
    if (isMobile) return;

    const mouseDown = () => setCursorVariant('click');
    const mouseUp = () => setCursorVariant('default');

    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [isMobile]);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1
    },
    click: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 0.8
    }
  };

  // Don't render anything on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="cursor"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 700,
          mass: 0.5
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '2px solid #00DC82',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference'
        }}
      />

      {/* Cursor dot */}
      <motion.div
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 800,
          mass: 0.2
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#00DC82',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference'
        }}
      />

      {/* Trail effect */}
      {trailPositions.map((position, index) => (
        <motion.div
          key={position.id}
          initial={{ opacity: 0.7, scale: 0.5 }}
          animate={{
            opacity: 0,
            scale: 0,
            x: position.x - 8,
            y: position.y - 8
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '1px solid #00DC82',
            boxShadow: '0 0 10px rgba(0, 220, 130, 0.5)',
            pointerEvents: 'none',
            zIndex: 9998,
            opacity: 0.7 - (index * 0.05)
          }}
        />
      ))}
    </>
  );
};

export default CursorEffect;
