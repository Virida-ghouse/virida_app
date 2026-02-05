import React from 'react';

const PlantCareNew: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-400">
          Conseils et guides pour prendre soin de vos plantes
        </p>
      </div>

      {/* Sections de soins */}
      <div className="grid grid-cols-2 gap-6">
        {/* Arrosage */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-400 text-2xl">water_drop</span>
            </div>
            <h3 className="text-xl font-bold text-white">Arrosage</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Maintenez un niveau d'humidité optimal pour chaque type de plante.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Vérifiez l'humidité du sol avant d'arroser</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Arrosez tôt le matin ou en fin de journée</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Évitez l'eau stagnante dans les soucoupes</span>
            </li>
          </ul>
        </div>

        {/* Lumière */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-400 text-2xl">light_mode</span>
            </div>
            <h3 className="text-xl font-bold text-white">Lumière</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Assurez un éclairage adapté aux besoins de vos cultures.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>6-8h de lumière directe pour la plupart des légumes</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Utilisez des lampes LED pour compléter</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Tournez les plantes pour une croissance uniforme</span>
            </li>
          </ul>
        </div>

        {/* Température */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-[#2AD368]/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#2AD368] text-2xl">thermostat</span>
            </div>
            <h3 className="text-xl font-bold text-white">Température</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Maintenez une température stable pour une croissance optimale.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>18-24°C pour la plupart des légumes</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Évitez les variations brusques</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Ventilez régulièrement la serre</span>
            </li>
          </ul>
        </div>

        {/* Nutriments */}
        <div className="glass-card backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-400 text-2xl">science</span>
            </div>
            <h3 className="text-xl font-bold text-white">Nutriments</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Fournissez les nutriments essentiels pour une croissance saine.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>NPK équilibré pour la croissance végétative</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Augmentez le phosphore pour la floraison</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <span className="material-symbols-outlined text-[#2AD368] text-lg">check_circle</span>
              <span>Surveillez le pH du sol (6.0-7.0)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Section tâches */}
      <div className="mt-6 glass-card backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#CBED62]">checklist</span>
          Tâches de maintenance
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Quotidien</p>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Vérifier l'humidité</li>
              <li>• Observer les plantes</li>
              <li>• Aérer la serre</li>
            </ul>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Hebdomadaire</p>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Fertiliser les plantes</li>
              <li>• Tailler si nécessaire</li>
              <li>• Nettoyer les feuilles</li>
            </ul>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Mensuel</p>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Vérifier le système</li>
              <li>• Rempoter si besoin</li>
              <li>• Nettoyer la serre</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCareNew;
