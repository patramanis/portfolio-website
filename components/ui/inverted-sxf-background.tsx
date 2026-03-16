"use client"

export function InvertedSxfBackground() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url('/images/sxf.png')",
        backgroundSize: "cover",
        backgroundPosition: "right -5%",
        filter: "blur(10px) invert(1)",
        transform: "scaleX(-1)",
        opacity: 0.2,
        pointerEvents: "none",
        zIndex: 0
      }}
    />
  )
}
