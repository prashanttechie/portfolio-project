'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track visitor
    const trackVisitor = async () => {
      try {
        await fetch('/api/visitors/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pathname,
          }),
        });
      } catch (error) {
        // Silently fail - don't break the page if tracking fails
        console.error('Failed to track visitor:', error);
      }
    };

    trackVisitor();
  }, [pathname]);

  return null; // This component doesn't render anything
}

