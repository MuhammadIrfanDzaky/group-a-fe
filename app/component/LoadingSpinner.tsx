const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-[#9B9A9A]/40 border-t-[#CDAA44] animate-spin" />
      <p className="text-[14px] font-medium tracking-wide">Loading product...</p>
    </div>
  );
};

export default LoadingSpinner;