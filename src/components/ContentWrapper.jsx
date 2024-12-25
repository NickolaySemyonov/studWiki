export default function ContentWrapper({ children }) {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-7xl w-full">
        {children}
      </div>
    </div>
  );
}
