import React from 'react';
import { motion } from 'framer-motion';
import EveMascote from '../../Eve_mascote.png';

interface Props {
  onClick?: () => void;
}

const EveCharacter: React.FC<Props> = ({ onClick }) => (
  <motion.div
    onClick={onClick}
    animate={{
      y: [0, -14, 0],
      rotate: [-3, 3, -3],
    }}
    transition={{
      duration: 3.8,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    whileHover={{ scale: 1.1, rotate: 8 }}
    style={{ cursor: onClick ? 'pointer' : 'default', originX: 0.5, originY: 1 }}
  >
    <img
      src={EveMascote}
      alt="Eve l'abeille"
      style={{
        width: 110,
        height: 110,
        objectFit: 'contain',
        filter: 'drop-shadow(0 8px 20px rgba(31,199,92,0.4))',
        userSelect: 'none',
      }}
      draggable={false}
    />
  </motion.div>
);

export default EveCharacter;
