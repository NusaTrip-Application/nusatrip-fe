export default function Footer() {
  return (
    <footer className="border-t bg-bg-surface py-8 mt-auto hidden md:block border-border-default">
      <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-text-body text-[14px] font-medium">
          © 2026 NusaTrip. All rights reserved.
        </p>
        <div className="flex items-center gap-8 text-[14px] text-text-body font-medium">
          <a href="#" className="hover:text-brand-primary transition-colors">Tentang Kami</a>
          <span className="text-text-soft">|</span>
          <a href="#" className="hover:text-brand-primary transition-colors">Kebijakan Privasi</a>
          <span className="text-text-soft">|</span>
          <a href="#" className="hover:text-brand-primary transition-colors">Syarat & Ketentuan</a>
          <span className="text-text-soft">|</span>
          <a href="#" className="hover:text-brand-primary transition-colors">Bantuan</a>
        </div>
      </div>
    </footer>
  );
}