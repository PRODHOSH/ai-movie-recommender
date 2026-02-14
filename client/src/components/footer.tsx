import { Github, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-8 px-6 bg-black/20 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Branding */}
          <div className="flex items-center gap-2 text-primary">
            <img src="/favicon.png" alt="CINE-AI" className="w-7 h-7" />
            <span className="font-display font-bold text-xl tracking-wide">CINE-AI</span>
          </div>

          {/* Center: Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://github.com/PRODHOSH/ai-movie-recommender"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
            <span className="text-white/20">|</span>
            <a
              href="https://prodhosh.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Portfolio
            </a>
          </div>

          {/* Right: Developer Info */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white font-medium">Developer</p>
              <p className="text-xs text-primary font-semibold">PRODHOSH</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/PRODHOSH"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all"
              >
                <Github className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.linkedin.com/in/prodhosh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center hover:bg-blue-600/30 hover:border-blue-500/50 transition-all"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
              </a>
              <a
                href="https://instagram.com/itzprodhosh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CINE-AI. Made with <span className="text-red-500">❤</span> by{" "}
            <a
              href="https://prodhosh.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Prodhosh
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
