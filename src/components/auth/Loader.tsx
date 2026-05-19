export function Loader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-manmitra-teal/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-manmitra-teal animate-spin" />
      </div>
    </div>
  );
}
