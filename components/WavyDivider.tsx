"use client";

type Props = {
  targetId: string;
};

export default function WavyDivider({ targetId }: Props) {
  const handleClick = () => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="relative h-[80px] overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Wave Background */}
      <svg
        viewBox="0 0 1440 320"
        className="absolute top-0 left-0 w-full h-full fill-white"
        preserveAspectRatio="none"
      >
        <path d="M0,160 C480,200 960,120 1440,160 L1440,320 L0,320 Z" />
      </svg>

      {/* Arrow + Lines */}
      <div className="absolute left-1/2 top-[30%] -translate-x-1/2 z-10 text-sky-400 flex items-center space-x-6">
        {/* Left line */}
        <span className="w-20 h-px bg-sky-300" />

        {/* Arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="animate-bounce"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M1.646 5.646a.5.5 0 0 1 .708 0L8 11.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>

        {/* Right line */}
        <span className="w-20 h-px bg-sky-300" />
      </div>
    </div>
  );
}
