import LegalPage from './LegalPage';

const content = {
  en: [
    { h: 'Who we are', p: 'This website belongs to Eglise Methodiste Libre au Rwanda (EMLR), Kicukiro Parish, Kigali, Rwanda.' },
    { h: 'What we collect', p: 'We only collect what you send us through the prayer request and volunteer forms: your name, email address, phone number and message. We do not use advertising trackers.' },
    { h: 'How we use it', p: 'Prayer requests are read only by the parish prayer team. Volunteer details are used to contact you about serving. We never sell or share your information with third parties.' },
    { h: 'Chat assistant', p: 'Questions typed into the chat assistant are sent to Google Gemini to generate an answer. Please do not share private or sensitive information in the chat.' },
    { h: 'Videos and maps', p: 'Videos are shown from YouTube and the map from Google Maps. These services may set their own cookies when you use them.' },
    { h: 'Storage and deletion', p: 'Your submissions are kept securely and only as long as needed. To see, correct or delete your information, email us at {email}.' },
  ],
  rw: [
    { h: 'Abo turi bo', p: 'Uru rubuga ni urwa Itorero Methodiste Libre mu Rwanda (EMLR), Paruwasi ya Kicukiro, i Kigali.' },
    { h: 'Amakuru dukusanya', p: 'Dukusanya gusa amakuru utwoherereje ukoresheje ifishi yo gusabirwa n’iyo gukorera itorero: amazina, imeyili, telefone n’ubutumwa bwawe. Ntidukoresha ibikoresho by’amatangazo y’ubucuruzi.' },
    { h: 'Uko tuyakoresha', p: 'Ubusabe bwo gusabirwa busomwa n’itsinda ry’amasengesho gusa. Amakuru y’abifuza gukorera itorero akoreshwa mu kubavugisha. Ntitugurisha kandi ntidusangiza abandi amakuru yawe.' },
    { h: 'Umufasha wo kuganira', p: 'Ibibazo wandika mu mufasha wo kuganira byoherezwa kuri Google Gemini kugira ngo itange igisubizo. Ntukandikemo amakuru bwite cyangwa y’ibanga.' },
    { h: 'Amashusho n’ikarita', p: 'Amashusho ava kuri YouTube, ikarita ikava kuri Google Maps. Izo serivisi zishobora gukoresha cookies zazo.' },
    { h: 'Kubika no gusiba', p: 'Amakuru yawe abikwa neza kandi mu gihe gikenewe gusa. Niba ushaka kuyabona, kuyakosora cyangwa kuyasiba, twandikire kuri {email}.' },
  ],
};

export default function PrivacyPolicy() {
  return <LegalPage title="Privacy Policy" content={content} updated="Last updated: October 2026" />;
}
