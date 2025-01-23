export default function Home() {
  return (
    <div className={"flex flex-col items-center justify-center min-h-screen py-2 bg-white"}>
      <h1 className={"text-6xl font-bold"}>Welcome</h1>
      <p className="text-lg mt-4">This text uses Geist Sans by default</p>
      <p className="font-mono text-lg mt-2">This text uses Geist Mono</p>
      <button className="mt-4">
        <a href={"/dashboard"}>Go to Dashboard</a>
      </button>
    </div>
  );
}
