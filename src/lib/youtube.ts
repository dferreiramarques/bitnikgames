// Extrai o ID de um link do YouTube em qualquer formato comum
// (watch?v=, youtu.be/, /embed/, /shorts/) e devolve o URL de embed em
// youtube-nocookie.com. Devolve null se o link não for reconhecível — quem
// chama decide o que fazer nesse caso (normalmente, cair para link simples).
export function youtubeEmbedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = parsed.pathname.slice(1);
  } else if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "m.youtube.com") {
    if (parsed.pathname === "/watch") {
      id = parsed.searchParams.get("v");
    } else if (parsed.pathname.startsWith("/embed/")) {
      id = parsed.pathname.slice("/embed/".length);
    } else if (parsed.pathname.startsWith("/shorts/")) {
      id = parsed.pathname.slice("/shorts/".length);
    }
  }

  id = id ? id.split(/[?&/]/)[0] : null;
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
