export default function NotFound() {
  return (
    <section id="landing" className="min-h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-white/70 mb-8">Oops! The page you're looking for doesn't exist.</p>
      <a href="/" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded shadow transition">
        Go Back Home
      </a>
    </section>
  );
}
