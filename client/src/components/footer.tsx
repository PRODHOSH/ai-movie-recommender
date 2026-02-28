import { Github, Instagram, Linkedin, Sparkles } from "lucide-react";

const FOOTER_LINKS = [
  { label: "GitHub Repo", href: "https://github.com/PRODHOSH/ai-movie-recommender" },
  { label: "Portfolio", href: "https://prodhosh.netlify.app" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/prodhoshvs" },
];

const SOCIALS = [
  { icon: Github, href: "https://github.com/PRODHOSH", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/prodhoshvs", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/itzprodhosh", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/favicon.png" alt="CINE-AI" className="w-7 h-7" />
              <span className="font-display font-bold text-xl tracking-wide text-primary">CINE-AI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-powered movie discovery. Tell us your mood, we find your next favorite film.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Powered by Gemini AI &amp; TMDB</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white uppercase tracking-widest">Links</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white uppercase tracking-widest">Developer</p>
            <div className="space-y-1">
              <p className="text-white font-semibold">Prodhosh</p>
              <a
                href="https://prodhosh.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                prodhosh.netlify.app
              </a>
            </div>
            <div className="flex items-center gap-3 pt-1">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CINE-AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with <span className="text-red-500">♥</span> by{" "}
            <a href="https://prodhosh.netlify.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Prodhosh
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
