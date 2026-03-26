import React, { useState } from 'react';
import { contactService } from '../../../services/api/contactService';

const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    interest: 'Participer à la beta',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Veuillez entrer une adresse email valide';
    }

    if (formData.message && formData.message.length > 2000) {
      errors.message = 'Le message ne peut pas dépasser 2000 caractères';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await contactService.submitContact({
        fullName: formData.name,
        email: formData.email,
        company: formData.company,
        interest: formData.interest,
        message: formData.message
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        interest: 'Participer à la beta',
        message: ''
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      if (err.status === 400) {
        const data = err.data;
        if (data.details && Array.isArray(data.details)) {
          const errors: Record<string, string> = {};
          data.details.forEach((detail: any) => {
            if (detail.field) {
              errors[detail.field] = detail.message;
            }
          });
          setValidationErrors(errors);
        }
        setError(data.error || 'Données invalides');
      } else if (err.status) {
        setError('Une erreur est survenue. Veuillez réessayer plus tard.');
      } else {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
      }
      console.error('Error submitting contact:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block">
            Rejoignez-nous
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-[var(--text-primary)]">
            Intéressé par Virida ?
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Inscrivez-vous pour participer à la beta, devenir partenaire ou simplement rester informé 
            de nos avancées.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 border-2 border-[var(--border-color)] backdrop-blur-xl relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#2AD368]/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#CBED62]/10 rounded-full blur-[100px]"></div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border ${validationErrors.name ? 'border-red-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-colors`}
                  placeholder="Jean Dupont"
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border ${validationErrors.email ? 'border-red-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-colors`}
                  placeholder="jean.dupont@example.com"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                )}
              </div>
            </div>

            {/* Entreprise/Organisation */}
            <div>
              <label htmlFor="company" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                Entreprise / Organisation (optionnel)
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-colors"
                placeholder="Mon Entreprise"
              />
            </div>

            {/* Type d'intérêt */}
            <div>
              <label htmlFor="interest" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                Je suis intéressé par *
              </label>
              <select
                id="interest"
                name="interest"
                required
                value={formData.interest}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-colors"
              >
                <option value="Participer à la beta">Participer à la beta</option>
                <option value="Obtenir une démo">Obtenir une démo</option>
                <option value="Partenariat">Partenariat</option>
                <option value="Investissement">Investissement</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                Message (optionnel)
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                maxLength={2000}
                className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border ${validationErrors.message ? 'border-red-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-colors resize-none`}
                placeholder="Parlez-nous de votre projet ou de vos besoins..."
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.message && (
                  <p className="text-red-500 text-xs">{validationErrors.message}</p>
                )}
                <p className={`text-xs ${formData.message.length > 1900 ? 'text-orange-500' : 'text-[var(--text-secondary)]'} ml-auto`}>
                  {formData.message.length}/2000
                </p>
              </div>
            </div>

            {/* Messages d'erreur/succès */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50">
                <p className="text-red-500 text-sm font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">error</span>
                  {error}
                </p>
              </div>
            )}

            {submitted && (
              <div className="p-4 rounded-xl bg-[#2AD368]/10 border border-[#2AD368]/50">
                <p className="text-[#2AD368] text-sm font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  Votre message a bien été envoyé, nous vous répondrons dès que possible !
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
              <p className="text-xs text-[var(--text-secondary)]">
                * Champs obligatoires
              </p>
              <button
                type="submit"
                disabled={isLoading || submitted}
                className={`
                  px-8 py-3 rounded-full font-bold text-base
                  transition-all duration-300
                  ${isLoading || submitted
                    ? 'bg-[#2AD368]/50 text-white cursor-not-allowed' 
                    : 'bg-[#2AD368] text-white hover:scale-105 shadow-xl shadow-[#2AD368]/20'
                  }
                `}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Envoi en cours...
                  </span>
                ) : submitted ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span>
                    Envoyé !
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined">send</span>
                    Envoyer
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info supplémentaire */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--text-secondary)] italic">
            Vos données sont traitées de manière confidentielle et ne seront jamais partagées avec des tiers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
