"use client"

export function SxfBackground() {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100vh - 1px)",
        left: 0,
        width: "100%",
        height: "250vh",
        backgroundImage: "url('/images/sxf.png')",
        backgroundSize: "cover",
        backgroundPosition: "top -5%",
        filter: "blur(10px)",
        transform: "translateY(-20px)",
        pointerEvents: "none",
        zIndex: 1
      }}
    />
  )
}
