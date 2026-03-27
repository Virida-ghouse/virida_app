import React from 'react';

interface CTASectionProps {
  onNavigateToLogin: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onNavigateToLogin }) => {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto glass-card rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 lg:p-16 text-center relative overflow-hidden border-2 border-[var(--border-color)] backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#2AD368]/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#CBED62]/10 rounded-full blur-[100px]"></div>

        <img
          alt="Eve - IA Virida"
          className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto mb-6 md:mb-8"
          src="/abeillevd.svg"
          style={{
            animation: 'float 6s ease-in-out infinite',
            filter: 'brightness(0) saturate(100%) invert(64%) sepia(89%) saturate(419%) hue-rotate(76deg) brightness(95%) contrast(92%) drop-shadow(0 0 20px rgba(42,211,104,0.5)) drop-shadow(0 0 10px rgba(203,237,98,0.4))'
          }}
        />

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-[var(--text-primary)] relative z-10">
          Prêt à planter ?
        </h2>

        <p className="text-[var(--text-secondary)] mb-8 md:mb-12 max-w-xl mx-auto text-base md:text-lg relative z-10 px-4">
          Rejoignez la communauté Virida et laissez EVE s'occuper de votre jardin.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center relative z-10 w-full max-w-md sm:max-w-none mx-auto">
          <button
            onClick={onNavigateToLogin}
            className="bg-[#2AD368] text-[var(--btn-primary-text)] font-bold px-8 md:px-10 lg:px-12 py-3 md:py-4 lg:py-5 rounded-full text-base md:text-lg shadow-xl shadow-[#2AD368]/20 hover:scale-105 transition-all w-full sm:w-auto"
          >
            Créer mon compte
          </button>
          <a
            href="#contact"
            className="bg-[var(--glass-bg)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold px-8 md:px-10 lg:px-12 py-3 md:py-4 lg:py-5 rounded-full text-base md:text-lg hover:border-[#2AD368] transition-all backdrop-blur-xl w-full sm:w-auto text-center"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
