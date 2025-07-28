import { useEffect, useRef } from 'react';

export function useHeightMonitor<T extends HTMLElement = HTMLDivElement>(dependencies: any[] = []) {
  const containerRef = useRef<T>(null);

  // Send height updates to parent window (for iframe embedding)
  useEffect(() => {
    const sendHeightUpdate = () => {
      if (containerRef.current && window.parent !== window) {
        const height = containerRef.current.scrollHeight;
        window.parent.postMessage({
          type: 'PASSITON_RESIZE',
          height: height
        }, '*');
      }
    };

    // Send initial height
    sendHeightUpdate();

    // Set up ResizeObserver to monitor height changes
    const resizeObserver = new ResizeObserver(() => {
      sendHeightUpdate();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Also send height update when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current && window.parent !== window) {
        const height = containerRef.current.scrollHeight;
        window.parent.postMessage({
          type: 'PASSITON_RESIZE',
          height: height
        }, '*');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, dependencies);

  return containerRef;
}