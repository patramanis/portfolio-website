"use client"

export function ScreenBackground() {
  return (
    <div
      style={{
        position: "absolute",
        top: "-50px",
        left: 0,
        width: "100%",
        height: "calc(100% + 200px)",
        backgroundImage: "url('/images/screen3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(0px)",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.5
      }}
    />
  )
}
