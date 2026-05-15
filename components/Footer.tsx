export default function Footer() {
  return (
    <footer className="border-t bg-white py-8 mt-auto hidden md:block border-[#E2E8F0]">
      <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-gray-500 text-sm font-medium">
          © 2025 NusaTrip. All rights reserved.
        </p>
        <div className="flex items-center gap-8 text-sm text-gray-600 font-medium">
          <a href="#" className="hover:text-[#0D7C4A] transition-colors">
            Tentang Kami
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-[#0D7C4A] transition-colors">
            Kebijakan Privasi
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-[#0D7C4A] transition-colors">
            Syarat & Ketentuan
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-[#0D7C4A] transition-colors">
            Bantuan
          </a>
        </div>
      </div>
    </footer>
  );
}
