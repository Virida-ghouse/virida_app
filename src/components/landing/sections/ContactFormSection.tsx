import React, { useState } from 'react';
import { contactService } from '../../../services/api/contactService';

const STEPS = [
  { id: 1, title: 'Vos coordonnées', icon: 'person' },
  { id: 2, title: 'Votre projet', icon: 'business' },
  { id: 3, title: 'Votre message', icon: 'chat' },
];

const INTERESTS = [
  { value: 'Participer à la beta', label: 'Participer à la beta', icon: 'science', desc: 'Testez Virida en avant-première' },
  { value: 'Obtenir une démo', label: 'Obtenir une démo', icon: 'play_circle', desc: 'Découvrez la plateforme en live' },
  { value: 'Partenariat', label: 'Partenariat', icon: 'handshake', desc: 'Collaborons ensemble' },
  { value: 'Investissement', label: 'Investissement', icon: 'trending_up', desc: 'Rejoignez l\'aventure' },
  { value: 'Autre', label: 'Autre', icon: 'more_horiz', desc: 'Une question, une idée...' },
];

const ContactFormSection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    interest: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Le nom doit contenir au moins 2 caractères';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'Veuillez entrer une adresse email valide';
      }
    }

    if (step === 2) {
      if (!formData.interest) {
        errors.interest = 'Veuillez sélectionner un sujet';
      }
    }

    if (step === 3) {
      if (formData.message && formData.message.length > 2000) {
        errors.message = 'Le message ne peut pas dépasser 2000 caractères';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    setValidationErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateStep(3)) return;

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
    } catch (err: any) {
      if (err.status === 400 && err.data?.details) {
        const errors: Record<string, string> = {};
        err.data.details.forEach((detail: any) => {
          if (detail.field) errors[detail.field] = detail.message;
        });
        setValidationErrors(errors);
        setError(err.data.error || 'Données invalides');
      } else if (err.status) {
        setError('Une erreur est survenue. Veuillez réessayer.');
      } else {
        setError('Impossible de contacter le serveur.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setFormData({ name: '', email: '', company: '', interest: '', message: '' });
  };

  // Success state
  if (submitted) {
    return (
      <section id="contact" className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-3xl p-10 md:p-14 border-2 border-[#2AD368]/30 text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#2AD368]/10 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#CBED62]/10 rounded-full blur-[100px]"></div>

            <div className="relative z-10">
              <div className="size-20 rounded-full bg-[#2AD368]/20 border-2 border-[#2AD368]/40 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[#2AD368] text-4xl">check_circle</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-3">
                Message envoyé !
              </h3>
              <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                Merci pour votre intérêt. Notre équipe vous répondra dans les plus brefs délais.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold hover:border-[#2AD368] transition-all"
              >
                Envoyer un autre message
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="text-[#2AD368] font-bold tracking-widest uppercase mb-4 block text-sm">
            Rejoignez-nous
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-[var(--text-primary)]">
            Intéressé par Virida ?
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Quelques informations pour mieux vous connaître et vous accompagner.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-6 md:p-10 border-2 border-[var(--border-color)] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#2AD368]/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#CBED62]/10 rounded-full blur-[100px]"></div>

          <div className="relative z-10">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-8">
              {STEPS.map((step, i) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`
                        size-10 md:size-12 rounded-full flex items-center justify-center transition-all duration-300 border-2
                        ${currentStep === step.id
                          ? 'bg-[#2AD368] border-[#2AD368] text-white shadow-lg shadow-[#2AD368]/30'
                          : currentStep > step.id
                            ? 'bg-[#2AD368]/20 border-[#2AD368]/50 text-[#2AD368]'
                            : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)]'
                        }
                      `}
                    >
                      {currentStep > step.id ? (
                        <span className="material-symbols-outlined text-lg">check</span>
                      ) : (
                        <span className="material-symbols-outlined text-lg">{step.icon}</span>
                      )}
                    </div>
                    <span className={`text-[10px] md:text-xs font-semibold hidden sm:block ${
                      currentStep >= step.id ? 'text-[#2AD368]' : 'text-[var(--text-secondary)]'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 md:mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.id ? 'bg-[#2AD368]' : 'bg-[var(--border-color)]'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1 — Coordonnées */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      autoFocus
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 rounded-xl bg-[var(--bg-secondary)] border ${validationErrors.name ? 'border-red-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-colors text-base`}
                      placeholder="Jean Dupont"
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

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
                      className={`w-full px-4 py-3.5 rounded-xl bg-[var(--bg-secondary)] border ${validationErrors.email ? 'border-red-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-colors text-base`}
                      placeholder="jean@example.com"
                    />
                    {validationErrors.email && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2 — Projet */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in">
                  <div>
                    <label htmlFor="company" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Organisation
                      <span className="font-normal text-[var(--text-secondary)] ml-1">(optionnel)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      autoFocus
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-colors text-base"
                      placeholder="Mon Entreprise / Association"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-3">
                      Je suis intéressé par *
                    </label>
                    {validationErrors.interest && (
                      <p className="text-red-400 text-xs mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {validationErrors.interest}
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {INTERESTS.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, interest: item.value });
                            setValidationErrors({ ...validationErrors, interest: '' });
                          }}
                          className={`
                            p-3.5 rounded-xl border-2 text-left transition-all duration-200
                            ${formData.interest === item.value
                              ? 'border-[#2AD368] bg-[#2AD368]/10 shadow-lg shadow-[#2AD368]/10'
                              : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[#2AD368]/40'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined text-xl ${
                              formData.interest === item.value ? 'text-[#2AD368]' : 'text-[var(--text-secondary)]'
                            }`}>
                              {item.icon}
                            </span>
                            <div>
                              <p className={`text-sm font-bold ${
                                formData.interest === item.value ? 'text-[#2AD368]' : 'text-[var(--text-primary)]'
                              }`}>
                                {item.label}
                              </p>
                              <p className="text-[11px] text-[var(--text-secondary)]">{item.desc}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Message */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in">
                  {/* Récap */}
                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Récapitulatif</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <span className="text-[var(--text-primary)]">{formData.name}</span>
                      <span className="text-[var(--text-secondary)]">{formData.email}</span>
                      {formData.company && <span className="text-[var(--text-secondary)]">{formData.company}</span>}
                      <span className="text-[#2AD368] font-semibold">{formData.interest}</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Message
                      <span className="font-normal text-[var(--text-secondary)] ml-1">(optionnel)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      autoFocus
                      value={formData.message}
                      onChange={handleChange}
                      maxLength={2000}
                      className={`w-full px-4 py-3.5 rounded-xl bg-[var(--bg-secondary)] border ${validationErrors.message ? 'border-red-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)] focus:border-[#2AD368] focus:outline-none transition-colors resize-none text-base`}
                      placeholder="Parlez-nous de votre projet, vos besoins, vos questions..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {validationErrors.message && (
                        <p className="text-red-400 text-xs">{validationErrors.message}</p>
                      )}
                      <p className={`text-xs ml-auto ${formData.message.length > 1900 ? 'text-orange-400' : 'text-[var(--text-secondary)]'}`}>
                        {formData.message.length}/2000
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-red-400 text-sm font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {error}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-color)]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold transition-all flex items-center gap-1.5 text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Retour
                  </button>
                ) : (
                  <p className="text-xs text-[var(--text-secondary)]">* Champs obligatoires</p>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 rounded-full bg-[#2AD368] text-white font-bold hover:scale-105 shadow-lg shadow-[#2AD368]/20 transition-all flex items-center gap-2"
                  >
                    Continuer
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                      px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2
                      ${isLoading
                        ? 'bg-[#2AD368]/50 text-white cursor-not-allowed'
                        : 'bg-[#2AD368] text-white hover:scale-105 shadow-lg shadow-[#2AD368]/20'
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                        Envoi...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">send</span>
                        Envoyer
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* RGPD */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--text-secondary)]">
            Vos données sont traitées de manière confidentielle et ne seront jamais partagées avec des tiers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
