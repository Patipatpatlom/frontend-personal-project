import { useEffect } from "react";

export default function SparkleCursor() {
  useEffect(() => {
    const sparkle = (e) => {
      const star = document.createElement("div");
      star.innerText = "✨";
      star.style.position = "fixed";
      star.style.left = e.clientX + "px";
      star.style.top = e.clientY + "px";
      star.style.pointerEvents = "none";
      star.style.fontSize = "14px";
      star.style.zIndex = "9999";
      document.body.appendChild(star);

      star.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(2)", opacity: 0 },
        ],
        { duration: 600 }
      );

      setTimeout(() => star.remove(), 600);
    };

    window.addEventListener("mousemove", sparkle);
    return () => window.removeEventListener("mousemove", sparkle);
  }, []);

  return null; // Side-effect component
}
