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
    <div className="relative h-[80px] overflow-hidden cursor-pointer" onClick={handleClick}>
      {/* Upward curve */}
      <svg
        viewBox="0 0 1440 80"
        className="absolute top-0 left-0 w-full h-full text-white"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,80 C480,0 960,0 1440,80 L1440,0 L0,0 Z"
        />
      </svg>

      {/* Downward arrow in center */}
      <div className="absolute left-1/2 top-[60%] -translate-x-1/2 text-sky-500 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M1.646 5.646a.5.5 0 0 1 .708 0L8 11.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </div>
    </div>
  );
}
