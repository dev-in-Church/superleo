const WORD = 'Superleo'

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <h1
        aria-label={WORD}
        className="font-serif text-6xl font-semibold tracking-tight text-primary sm:text-7xl md:text-8xl lg:text-9xl"
      >
        {WORD.split('').map((letter, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="superleo-letter"
            style={{ '--delay': `${index * 0.09}s` } as React.CSSProperties}
          >
            {letter}
          </span>
        ))}
      </h1>
    </main>
  )
}
