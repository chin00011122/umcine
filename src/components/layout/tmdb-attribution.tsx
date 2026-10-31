export function TmdbAttribution() {
  return (
    <footer className="flex flex-col items-center gap-3 border-t border-slate-200 bg-white px-5 py-7 text-center text-xs text-slate-500">
      <img src="/images/logos/tmdb-logo.svg" alt="The Movie Database" className="h-5 w-auto" />
      <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    </footer>
  );
}
