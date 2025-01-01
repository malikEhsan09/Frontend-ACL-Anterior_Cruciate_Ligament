import React from 'react';
import styles from './toast.module.css';

interface ToastProps {
  title: string;
  description: string;
  type: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ title, description, type }) => {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <h4 className={styles.toastTitle}>{title}</h4>
      <p>{description}</p>
    </div>
  );
};

