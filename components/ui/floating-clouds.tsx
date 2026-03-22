"use client"

import Image from "next/image"

interface FloatingCloud {
    src: string
    top: string
    left: string
    size: number
}

const clouds: FloatingCloud[] = [
    {
        src: "/images/Welcome (1).png",
        top: "180px",
        left: "120px",
        size: 240,
    },
    {
        src: "/images/Welcome (2).png",
        top: "330px",
        left: "calc(98% - 290px)",
        size: 290,
    },
    {
        src: "/images/Welcome (3).png",
        top: "100px",
        left: "calc(41% - 75px)",
        size: 200,
    },
]

export function FloatingClouds() {
    return (
        <div
            className="clouds-fade-wrapper absolute -inset-20 pointer-events-none overflow-visible"
            style={{ zIndex: 9999 }}
        >
            <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-8px) translateX(4px); }
          50% { transform: translateY(-4px) translateX(-4px); }
          75% { transform: translateY(-10px) translateX(2px); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-6px) translateX(-3px); }
          50% { transform: translateY(-8px) translateX(3px); }
          75% { transform: translateY(-5px) translateX(-2px); }
        }

        @keyframes float3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-7px) translateX(2px); }
          50% { transform: translateY(-3px) translateX(-3px); }
          75% { transform: translateY(-9px) translateX(3px); }
        }

        .cloud-1 {
          animation: float1 6s ease-in-out infinite;
          position: absolute;
        }

        .cloud-2 {
          animation: float2 7s ease-in-out infinite 1s;
          position: absolute;
        }

        .cloud-3 {
          animation: float3 8s ease-in-out infinite 0.5s;
          position: absolute;
        }

        .clouds-fade-wrapper {
          opacity: 1;
          transition: opacity 0.8s ease;
        }

        /* Fade directly from full to gone — visible only at wide viewports */
        @media (max-width: 1280px) {
          .clouds-fade-wrapper {
            opacity: 0 !important;
            pointer-events: none;
          }
        }
      `}</style>

            {clouds.map((cloud, index) => (
                <div
                    key={index}
                    className={`cloud-${index + 1}`}
                    style={{
                        top: cloud.top,
                        left: cloud.left,
                        zIndex: 9999,
                    }}
                >
                    <Image
                        src={cloud.src}
                        alt="floating cloud"
                        width={cloud.size}
                        height={cloud.size}
                        className="object-contain drop-shadow-lg select-none"
                        priority
                        draggable={false}
                    />
                </div>
            ))}
        </div>
    )
}
