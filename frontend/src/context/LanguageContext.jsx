import { createContext, useState, useContext, useEffect } from "react";

// Translation dictionaries for patient accessibility
const translations = {
  en: {
    // Navigation
    home: "Home",
    practitioners: "Practitioners",
    services: "Services",
    about: "About",
    contact: "Contact",
    dashboard: "Dashboard",
    login: "Sign In",
    register: "Register",
    logout: "Sign Out",
    get_started: "Get Started",

    // Hero Section
    verified_network: "Verified Tele-Healthcare Network",
    hero_title: "Your Health, Our Priority — Instant Online Bookings",
    hero_subtitle: "Connect with top-rated medical specialists, schedule in-person or video consultations, access digital prescriptions, and manage your clinical records securely.",
    find_doctor: "Find a Doctor",
    create_account: "Create Account",
    go_to_dashboard: "Go to Dashboard",

    // Trust Stats
    stat_doctors: "Verified Doctors",
    stat_satisfaction: "Patient Satisfaction",
    stat_care: "Virtual Care",

    // Doctor Highlight Card
    live_availability: "Live Availability",
    senior_cardiologist: "Senior Cardiologist",
    slot_available: "Next Time Slot Available",
    slot_time: "Today • 02:30 PM - Virtual & Clinic",
    book_consultation: "Book Consultation",

    // Medical Specialties
    explore_specialties: "Explore Medical Specialties",
    specialties_desc: "Find expert medical consultants across all clinical departments for personalized care.",
    cardiology: "Cardiology",
    cardiology_desc: "Heart health & cardiovascular diagnostics",
    general_medicine: "General Medicine",
    general_medicine_desc: "Primary health consultations & checkups",
    neurology: "Neurology",
    neurology_desc: "Brain, spine, and nerve care specialists",
    orthopedics: "Orthopedics",
    orthopedics_desc: "Bone, joint, and spinal rehabilitation",

    // Footer
    footer_bio: "Connecting patients with verified healthcare specialists online. Schedule appointments, consult virtually, and access medical records securely.",
    hipaa_certified: "Certified HIPAA Compliant Network",
    quick_links: "Quick Links",
    contact_support: "Contact Support",
    rights_reserved: "HealthCare Booking & Consultation Portal. All rights reserved.",
  },

  es: {
    // Navigation
    home: "Inicio",
    practitioners: "Médicos",
    services: "Servicios",
    about: "Nosotros",
    contact: "Contacto",
    dashboard: "Panel",
    login: "Iniciar Sesión",
    register: "Registrarse",
    logout: "Cerrar Sesión",
    get_started: "Comenzar",

    // Hero Section
    verified_network: "Red de Telemedicina Verificada",
    hero_title: "Su Salud es Nuestra Prioridad — Citas Médicas en Línea",
    hero_subtitle: "Conéctese con especialistas médicos calificados, programe consultas presenciales o por video y gestione su historial clínico de forma segura.",
    find_doctor: "Buscar un Médico",
    create_account: "Crear Cuenta",
    go_to_dashboard: "Ir al Panel",

    // Trust Stats
    stat_doctors: "Médicos Verificados",
    stat_satisfaction: "Satisfacción del Paciente",
    stat_care: "Atención Virtual",

    // Doctor Highlight Card
    live_availability: "Disponibilidad en Vivo",
    senior_cardiologist: "Cardióloga Senior",
    slot_available: "Próximo Turno Disponible",
    slot_time: "Hoy • 02:30 PM - Virtual y Clínica",
    book_consultation: "Reservar Consulta",

    // Medical Specialties
    explore_specialties: "Explorar Especialidades Médicas",
    specialties_desc: "Encuentre médicos consultores expertos en todas las áreas clínicas.",
    cardiology: "Cardiología",
    cardiology_desc: "Salud del corazón y diagnóstico cardiovascular",
    general_medicine: "Medicina General",
    general_medicine_desc: "Consultas de salud primaria y chequeos",
    neurology: "Neurología",
    neurology_desc: "Especialistas en cerebro, columna y nervios",
    orthopedics: "Ortopedia",
    orthopedics_desc: "Rehabilitación de huesos, articulaciones y columna",

    // Footer
    footer_bio: "Conectando pacientes con especialistas médicos verificados en línea de manera segura.",
    hipaa_certified: "Red Certificada HIPAA",
    quick_links: "Enlaces Rápidos",
    contact_support: "Soporte Técnico",
    rights_reserved: "Portal de Reservas Médicas. Todos los derechos reservados.",
  },

  fr: {
    // Navigation
    home: "Accueil",
    practitioners: "Médecins",
    services: "Services",
    about: "À Propos",
    contact: "Contact",
    dashboard: "Tableau de Bord",
    login: "Connexion",
    register: "S'inscrire",
    logout: "Déconnexion",
    get_started: "Commencer",

    // Hero Section
    verified_network: "Réseau de Télé-Santé Vérifié",
    hero_title: "Votre Santé, Notre Priorité — Rendez-vous en Ligne",
    hero_subtitle: "Prenez rendez-vous avec des spécialistes médicaux qualifiés, effectuez des consultations vidéo et gérez vos dossiers médicaux.",
    find_doctor: "Trouver un Médecin",
    create_account: "Créer un Compte",
    go_to_dashboard: "Aller au Tableau de Bord",

    // Trust Stats
    stat_doctors: "Médecins Vérifiés",
    stat_satisfaction: "Satisfaction Patients",
    stat_care: "Soins Virtuels",

    // Doctor Highlight Card
    live_availability: "Disponibilité en Direct",
    senior_cardiologist: "Cardiologue Senior",
    slot_available: "Prochain Créneau Disponible",
    slot_time: "Aujourd'hui • 14h30 - Virtuel & Clinique",
    book_consultation: "Réserver une Consultation",

    // Medical Specialties
    explore_specialties: "Explorer les Spécialités Médicales",
    specialties_desc: "Trouvez des consultants experts dans tous les départements cliniques.",
    cardiology: "Cardiologie",
    cardiology_desc: "Santé cardiaque et diagnostics cardiovasculaires",
    general_medicine: "Médecine Générale",
    general_medicine_desc: "Consultations de santé primaire et bilans",
    neurology: "Neurologie",
    neurology_desc: "Spécialistes du cerveau, de la colonne et des nerfs",
    orthopedics: "Orthopédie",
    orthopedics_desc: "Réhabilitation des os, des articulations et de la colonne",

    // Footer
    footer_bio: "Mise en relation sécurisée des patients avec des médecins spécialistes vérifiés.",
    hipaa_certified: "Réseau Certifié HIPAA",
    quick_links: "Liens Rapides",
    contact_support: "Support Client",
    rights_reserved: "Portail de Réservation Médicale. Tous droits réservés.",
  },

  hi: {
    // Navigation
    home: "मुख्य पृष्ठ",
    practitioners: "डॉक्टर्स",
    services: "सेवाएं",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    dashboard: "डैशबोर्ड",
    login: "साइन इन",
    register: "पंजीकरण करें",
    logout: "साइन आउट",
    get_started: "शुरू करें",

    // Hero Section
    verified_network: "सत्यापित टेली-स्वास्थ्य नेटवर्क",
    hero_title: "आपका स्वास्थ्य, हमारी प्राथमिकता — त्वरित ऑनलाइन बुकिंग",
    hero_subtitle: "शीर्ष रेटेड डॉक्टरों से जुड़ें, परामर्श शेड्यूल करें और अपना मेडिकल रिकॉर्ड सुरक्षित रूप से प्रबंधित करें।",
    find_doctor: "डॉक्टर खोजें",
    create_account: "खाता बनाएं",
    go_to_dashboard: "डैशबोर्ड पर जाएं",

    // Trust Stats
    stat_doctors: "सत्यापित डॉक्टर्स",
    stat_satisfaction: "मरीजों की संतुष्टि",
    stat_care: "वर्चुअल देखभाल",

    // Doctor Highlight Card
    live_availability: "लाइव उपलब्धता",
    senior_cardiologist: "वरिष्ठ हृदय रोग विशेषज्ञ",
    slot_available: "अगला समय स्लॉट उपलब्ध",
    slot_time: "आज • 02:30 PM - ऑनलाइन व क्लीनिक",
    book_consultation: "परामर्श बुक करें",

    // Medical Specialties
    explore_specialties: "चिकित्सा विशेषज्ञताओं की खोज करें",
    specialties_desc: "व्यक्तिगत देखभाल के लिए विशेषज्ञ डॉक्टरों को खोजें।",
    cardiology: "हृदय रोग (Cardiology)",
    cardiology_desc: "हृदय स्वास्थ्य और कार्डियोवास्कुलर निदान",
    general_medicine: "सामान्य चिकित्सा",
    general_medicine_desc: "प्राथमिक स्वास्थ्य परामर्श और जांच",
    neurology: "न्यूरोलॉजी (Neurology)",
    neurology_desc: "मस्तिष्क, रीढ़ और तंत्रिका विशेषज्ञ",
    orthopedics: "ऑर्थोपेडिक्स (Orthopedics)",
    orthopedics_desc: "हड्डी, जोड़ और रीढ़ की हड्डी का पुनर्वास",

    // Footer
    footer_bio: "मरीजों को सत्यापित डॉक्टरों से ऑनलाइन सुरक्षित रूप से जोड़ना।",
    hipaa_certified: "HIPAA प्रमाणित नेटवर्क",
    quick_links: "त्वरित लिंक",
    contact_support: "सहायता केंद्र",
    rights_reserved: "हेल्थकेयर बुकिंग पोर्टल। सर्वाधिकार सुरक्षित।",
  },

  te: {
    // Navigation
    home: "హోమ్",
    practitioners: "వైద్యులు (Doctors)",
    services: "సేవలు",
    about: "మా గురించి",
    contact: "సంప్రదించండి",
    dashboard: "డాష్‌బోర్డ్",
    login: "లాగిన్",
    register: "రిజిస్టర్",
    logout: "లాగ్ అవుట్",
    get_started: "ప్రారంభించండి",

    // Hero Section
    verified_network: "ధృవీకరించబడిన టెలి-హెల్త్‌కేర్ నెట్‌వర్క్",
    hero_title: "మీ ఆరోగ్యం, మా ప్రాధాన్యత — తక్షణ ఆన్‌లైన్ బుకింగ్స్",
    hero_subtitle: "నిపుణులైన వైద్యులను కలవండి, ఆన్‌లైన్ లేదా ఇన్-పర్సన్ అపాయింట్‌మెంట్స్ బుక్ చేసుకోండి.",
    find_doctor: "డాక్టర్‌ను వెతకండి",
    create_account: "ఖాతాను సృష్టించండి",
    go_to_dashboard: "డాష్‌బోర్డ్‌కు వెళ్లండి",

    // Trust Stats
    stat_doctors: "ధృవీకరించబడిన డాక్టర్లు",
    stat_satisfaction: "రోగుల సంతృప్తి",
    stat_care: "వర్చువల్ కేర్",

    // Doctor Highlight Card
    live_availability: "లైవ్ లభ్యత",
    senior_cardiologist: "సీనియర్ కార్డియాలజిస్ట్",
    slot_available: "తదుపరి స్లాట్ అందుబాటులో ఉంది",
    slot_time: "ఈ రోజు • 02:30 PM - ఆన్‌లైన్ & క్లినిక్",
    book_consultation: "సలహా బుక్ చేయండి",

    // Medical Specialties
    explore_specialties: "వైద్య విభాగాలు",
    specialties_desc: "అన్ని వైద్య విభాగాలలో నిపుణులైన వైద్యులను వెతకండి.",
    cardiology: "కార్డియాలజీ (గుండె సంరక్షణ)",
    cardiology_desc: "గుండె ఆరోగ్యం మరియు నిర్ధారణ",
    general_medicine: "సాధారణ వైద్యం",
    general_medicine_desc: "ప్రాథమిక ఆరోగ్య పరిశీలనలు",
    neurology: "న్యూరాలజీ (నరాల సంరక్షణ)",
    neurology_desc: "మెదడు, వెన్నుముక నిపుణులు",
    orthopedics: "ఆర్థోపెడిక్స్ (ఎముకల సంరక్షణ)",
    orthopedics_desc: "ఎముకలు, కీళ్ల పునరావాసం",

    // Footer
    footer_bio: "రోగులను ధృవీకరించబడిన వైద్యులతో సురక్షితంగా అనుసంధానించడం.",
    hipaa_certified: "HIPAA ధృవీకరించబడిన నెట్‌వర్క్",
    quick_links: "త్వరిత లింక్‌లు",
    contact_support: "సహాయ కేంద్రం",
    rights_reserved: "హెల్త్‌కేర్ బుకింగ్ పోర్టల్. సర్వహక్కులు నిరోధించబడ్డాయి.",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app_language") || "en";
  });

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem("app_language", langCode);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
