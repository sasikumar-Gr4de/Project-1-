export const DefaultAvatar = ({ type = "player", className = "w-10 h-10" }) => {
  const baseClasses =
    "rounded-full flex items-center justify-center text-white font-semibold";

  if (type === "club") {
    return (
      <div
        className={`${baseClasses} ${className} bg-linear-to-br from-blue-500 to-blue-600`}
      >
        {/* Shield icon for clubs */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${className} bg-linear-to-br from-green-500 to-green-600`}
    >
      {/* User icon for players */}
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  );
};
