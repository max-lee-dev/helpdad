export default function Home() {
  return (
    <div className={"flex flex-col font-lato items-center justify-center min-h-screen py-2 bg-white"}>
      <h1 className={"text-6xl text-black font-bold"}>Welcome</h1>
      <p className="text-lg  font-lato mt-4">This text uses Geist Sans by default</p>
      <p className="font-mono text-lg mt-2">This text uses Geist Mono</p>

      <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50">
        <a href={"/input"} className="no-underline font-mono font-bold text-xl text-white">Input</a>
      </button>
      <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50">
        <a href={"/dashboard"} className="no-underline font-mono font-bold text-xl text-white">Dashboard</a>
      </button>
    </div>s
  );
}
