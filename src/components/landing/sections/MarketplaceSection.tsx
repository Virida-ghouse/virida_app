import React from 'react';

const MarketplaceSection: React.FC = () => {
  const products = [
    {
      name: "Tomates Héritage",
      description: "Pack Pro - 50 graines",
      price: "12.90€",
      icon: "nutrition"
    },
    {
      name: "Bio-Boost 1L",
      description: "Nutriments liquides premium",
      price: "24.50€",
      icon: "science"
    },
    {
      name: "Laitue Hydro",
      description: "Producteur : J. Dupont",
      price: "4.20€",
      badge: "RÉCOLTE LOCALE",
      icon: "eco"
    },
    {
      name: "LED Full Spectrum",
      description: "Équipement Pro 45W",
      price: "89.00€",
      icon: "lightbulb"
    }
  ];

  return (
    <section id="marche" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
        <div>
          <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block">
            Marketplace
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)]">
            De la graine à l'assiette
          </h2>
        </div>
        <button className="text-[#2AD368] font-bold flex items-center gap-2 hover:translate-x-2 transition-transform text-sm md:text-base">
          Explorer le marché 
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {products.map((product, index) => (
          <div 
            key={index}
            className="glass-card p-3 rounded-[2rem] group cursor-pointer hover:border-[#2AD368]/40 transition-all border border-[var(--border-color)] backdrop-blur-xl"
          >
            <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-gradient-to-br from-[#2AD368]/10 to-[#CBED62]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#2AD368] text-6xl group-hover:scale-110 transition-transform duration-500">
                {product.icon}
              </span>
              {product.badge && (
                <div className="absolute top-3 left-3 bg-[#2AD368] text-[var(--btn-primary-text)] px-3 py-1 rounded-full text-[10px] font-bold">
                  {product.badge}
                </div>
              )}
              <div className="absolute top-3 right-3 bg-[var(--glass-bg)] backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[var(--text-primary)] border border-[var(--border-color)]">
                {product.price}
              </div>
            </div>
            <div className="px-2 pb-2">
              <h4 className="font-bold mb-1 group-hover:text-[#2AD368] transition-colors text-[var(--text-primary)]">
                {product.name}
              </h4>
              <p className="text-[var(--text-secondary)] text-xs">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketplaceSection;
