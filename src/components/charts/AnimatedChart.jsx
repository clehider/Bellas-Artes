import { motion } from 'framer-motion';
import { useState } from 'react';

const AnimatedChart = ({ children, title, exportOptions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      style={{
        ...styles.container,
        ...(isExpanded ? styles.expanded : {})
      }}
    >
      <div style={styles.header}>
        <motion.h3 
          layout="position"
          style={styles.title}
        >
          {title}
        </motion.h3>
        <div style={styles.headerActions}>
          {exportOptions}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={styles.expandButton}
          >
            {isExpanded ? '🔍' : '⤢'}
          </button>
        </div>
      </div>
      <motion.div
        layout
        style={styles.content}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
  },
  expanded: {
    position: 'fixed',
    top: '5%',
    left: '5%',
    right: '5%',
    bottom: '5%',
    zIndex: 1000,
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1.2em',
    color: '#2d3748',
    fontWeight: '500',
  },
  expandButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2em',
    cursor: 'pointer',
    padding: '5px',
    color: '#4a5568',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  content: {
    width: '100%',
    height: '100%',
  },
};

export default AnimatedChart;
