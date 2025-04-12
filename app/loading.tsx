'use client';

import { useEffect } from 'react';
import styles from '../styles/OrbitLoader.module.css';

const OrbitLoader = () => {
  useEffect(() => {
    // Disable scrolling while the loader is visible
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling after the loader is removed
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="absolute overflow-hidden z-[1000] inset-0 flex justify-center items-center bg-white/70 dark:bg-gray-700/55">
      <div className={styles.container}>
        <div className={styles.slice}></div>
        <div className={styles.slice}></div>
        <div className={styles.slice}></div>
        <div className={styles.slice}></div>
        <div className={styles.slice}></div>
        <div className={styles.slice}></div>
      </div>
    </div>
  );
};

export default OrbitLoader;
