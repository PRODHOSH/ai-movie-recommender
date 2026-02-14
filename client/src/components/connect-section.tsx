import { useState } from "react";
import { Mail, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function ConnectSection() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the Google Form URL with prefilled values
    const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfIw_rf9ccNo5kbVgmuBwmmMf1C9y4NwD7_QaR5rM4asRZEdA/formResponse";
    
    // Google Form entry IDs
    const emailEntry = "entry.769396245";
    const messageEntry = "entry.105259584";
    
    // Create form data
    const formData = new URLSearchParams();
    formData.append(emailEntry, name || "Anonymous");
    formData.append(messageEntry, message);
    
    // Submit the form in an iframe (hidden submission)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'hidden_iframe';
    document.body.appendChild(iframe);
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = baseUrl;
    form.target = 'hidden_iframe';
    
    formData.forEach((value, key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
    }, 1000);
    
    // Clear form and show success
    setName("");
    setMessage("");
    
    // Show success notification
    alert("Message sent! I'll get back to you soon. 📬");
  };

  return (
    <section className="relative z-10 py-16 px-6 bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
            <MessageSquare className="w-4 h-4" />
            <span>Let's Connect</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Connect with the Developer
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Have a project idea, feedback, or just want to say hi? Drop me a message!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Email Card */}
          <div className="bg-card/50 border border-white/10 rounded-2xl p-8 space-y-4 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Email Me</h3>
              <a
                href="mailto:prodhoshlaptop@gmail.com"
                className="text-primary hover:underline text-sm font-medium"
              >
                prodhoshlaptop@gmail.com
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              I typically respond within 24-48 hours
            </p>
          </div>

          {/* Quick Message Form */}
          <div className="bg-card/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Your Name / Email
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe / john@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'd love to connect..."
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
