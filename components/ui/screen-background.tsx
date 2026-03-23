"use client"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

export function ScreenBackground() {
  return (
    <>
      <style>{`
        .screen-bg {
          position: absolute;
          top: -50px;
          left: 0;
          width: 100%;
          height: calc(100% + 200px);
          background-image: url('${basePath}/images/screen3.png');
          background-size: cover;
          background-position: center;
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
          transition: opacity 0.8s ease;
        }

        /* Fades together with the clouds (same 1280px threshold) */
        @media (max-width: 1280px) {
          .screen-bg { opacity: 0; }
        }
      `}</style>
      <div className="screen-bg" />
    </>
  )
}
