import LegalPage from './LegalPage';

const content = {
  en: [
    { h: 'Use of this website', p: 'By using this website you agree to these terms. The site shares information about EMLR Kicukiro Parish, its services, ministries and activities.' },
    { h: 'Content', p: 'Texts, photos and videos belong to EMLR Kicukiro unless stated otherwise. You may share them for non-commercial purposes with a reference to the church.' },
    { h: 'Your conduct', p: 'Please use the forms and chat assistant respectfully and only for lawful purposes. Do not send spam or harmful content.' },
    { h: 'Accuracy', p: 'We work to keep information correct and up to date. Answers from the chat assistant are generated automatically and may contain mistakes; please confirm important details with the parish.' },
    { h: 'Donations', p: 'Donations are made directly to the church accounts shown on the Donate page. This website does not process payments.' },
    { h: 'Changes and contact', p: 'We may update these terms from time to time. For questions, contact us at {email}.' },
  ],
  rw: [
    { h: 'Ikoreshwa ry’uru rubuga', p: 'Gukoresha uru rubuga bivuze ko wemera aya mabwiriza. Urubuga rutanga amakuru kuri Paruwasi ya Kicukiro, amateraniro yayo, ibyiciro n’ibikorwa byayo.' },
    { h: 'Ibikubiye ku rubuga', p: 'Inyandiko, amafoto n’amashusho ni ibya EMLR Kicukiro keretse bivuzwe ukundi. Wemerewe kubisangiza bitari iby’ubucuruzi, ugaragaza ko ari iby’itorero.' },
    { h: 'Imyitwarire', p: 'Koresha amafishi n’umufasha wo kuganira mu kinyabupfura kandi mu buryo bwemewe n’amategeko. Ntukohereze ubutumwa bwangiza cyangwa butari ngombwa.' },
    { h: 'Ukuri kw’amakuru', p: 'Duharanira ko amakuru aba ari ukuri kandi agezweho. Ibisubizo by’umufasha wo kuganira bitangwa n’ikoranabuhanga kandi bishobora kugira amakosa; baza Paruwasi ku makuru y’ingenzi.' },
    { h: 'Amaturo', p: 'Amaturo yoherezwa mu buryo butaziguye kuri konti z’itorero zigaragara ku rupapuro rwa Donate. Uru rubuga ntirwakira amafaranga.' },
    { h: 'Impinduka no kutwandikira', p: 'Aya mabwiriza ashobora guhinduka. Ku kibazo icyo ari cyo cyose, twandikire kuri {email}.' },
  ],
};

export default function TermsOfService() {
  return <LegalPage title="Terms of Service" content={content} updated="Last updated: October 2026" />;
}
