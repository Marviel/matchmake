import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">AI Date Cards</h1>
      <p className="text-xl mb-8">Improve your dates with AI-powered conversation suggestions</p>
      <Link href="/cards" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Start Your Date
      </Link>
    </main>
  )
}
