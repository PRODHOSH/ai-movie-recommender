import { ConnectSection } from "@/components/connect-section";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Get in Touch</h1>
        <p className="text-muted-foreground">
          Have questions, feedback, or just want to say hi? I'd love to hear from you!
        </p>
      </div>
      <ConnectSection />
    </div>
  );
}
