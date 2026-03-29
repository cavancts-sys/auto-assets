import { useRef, useEffect, useState } from "react";

interface MarqueeTextProps {
  children: React.ReactNode;
  className?: string;
  /** pixels per second — controls how fast the text travels */
  speed?: number;
}

/**
 * Renders text normally when it fits.
 * When it overflows, the text slides left until the last character is visible,
 * pauses, then slides back — ping-pong style, forever.
 */
export function MarqueeText({ children, className = "", speed = 40 }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef  = useRef<HTMLSpanElement>(null);
  const [shift,    setShift]    = useState(0);   // px to scroll (positive number)
  const [duration, setDuration] = useState(4);   // seconds for one direction

  useEffect(() => {
    let cancelled = false;

    const check = () => {
      if (cancelled) return;
      const container = containerRef.current;
      const measure   = measureRef.current;
      if (!container || !measure) return;

      const textW = measure.offsetWidth;   // natural text width (not clipped)
      const boxW  = container.clientWidth;

      if (textW === 0 || boxW === 0) return;

      const overflow = textW - boxW;
      if (overflow > 1) {
        setShift(overflow);
        setDuration(Math.max(1.5, overflow / speed));
      } else {
        setShift(0);
      }
    };

    const raf = requestAnimationFrame(check);
    const t1  = setTimeout(check, 80);
    const t2  = setTimeout(check, 350);

    const ro = new ResizeObserver(check);
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
    };
  }, [children, speed]);

  const isAnimating = shift > 0;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Hidden measurement span — absolutely positioned so overflow:hidden
          on the container doesn't restrict its offsetWidth */}
      <span
        ref={measureRef}
        aria-hidden
        className="absolute whitespace-nowrap invisible pointer-events-none top-0 left-0"
      >
        {children}
      </span>

      <span
        className={`whitespace-nowrap inline-block ${isAnimating ? "animate-marquee" : ""}`}
        style={isAnimating ? {
          "--marquee-shift": `-${shift}px`,
          "--marquee-duration": `${duration}s`,
        } as React.CSSProperties : undefined}
      >
        {children}
      </span>
    </div>
  );
}
