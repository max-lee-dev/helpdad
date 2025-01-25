import Navbar from '@/app/components/Navbar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center mt-10">
        <h1 className="text-6xl text-black font-bold">Welcome</h1>
        <div className="flex flex-row space-x-4">
          <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50">
            <a href={"/input"} className="no-underline font-mono font-bold text-xl text-white">Input</a>
          </button>
          <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50">
            <a href={"/dashboard"} className="no-underline font-mono font-bold text-xl text-white">Dashboard</a>
          </button>
        </div>
      </div>
    </div>
  );
}
