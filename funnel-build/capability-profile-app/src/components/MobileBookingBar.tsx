import { useEffect, useState } from 'react';
import { BookingLink } from './SiteHeader';

export function MobileBookingBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const target = document.querySelector('.hero-actions');
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { rootMargin: '-70px 0px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return <div className={`mobile-booking-bar${visible ? ' is-visible' : ''}`}><BookingLink location="mobile-sticky">Book an Application Review</BookingLink></div>;
}
