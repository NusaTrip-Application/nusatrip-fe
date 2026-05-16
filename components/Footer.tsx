export default function Footer() {
  return (
    <footer className="border-t bg-white py-8 mt-auto hidden md:block border-[#E2E8F0]">
      <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-[#475569] text-sm font-medium">
          © 2025 NusaTrip. All rights reserved.
        </p>
        <div className="flex items-center gap-8 text-sm text-[#475569] font-medium">
          <a href="#" className="hover:text-[#1D4ED8] transition-colors">
            Tentang Kami
          </a>
          <span className="text-[#CBD5E1]">|</span>
          <a href="#" className="hover:text-[#1D4ED8] transition-colors">
            Kebijakan Privasi
          </a>
          <span className="text-[#CBD5E1]">|</span>
          <a href="#" className="hover:text-[#1D4ED8] transition-colors">
            Syarat & Ketentuan
          </a>
          <span className="text-[#CBD5E1]">|</span>
          <a href="#" className="hover:text-[#1D4ED8] transition-colors">
            Bantuan
          </a>
        </div>
      </div>
    </footer>
  );
}
