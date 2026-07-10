export default function Container({ className = '', children }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
