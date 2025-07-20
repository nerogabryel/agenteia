import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-semibold text-honey mb-4">BeeMind</h1>
      <p className="text-lg text-center max-w-md mb-8">
        Bem-vindo ao BeeMind - seu espaço acolhedor de cuidado mental.
      </p>
      <Link
        href="/chat"
        className="bg-honey text-neutralBg px-4 py-2 rounded-md font-medium hover:bg-amber transition-colors"
      >
        Iniciar Conversa
      </Link>
    </main>
  );
}