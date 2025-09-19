// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo(0,0);
    console.log('top now')
  }, [pathname]);

  return null;
};

export default ScrollToTop;
