/**
 * Seeds the admin user and the starting website content.
 *
 * Content is only written into an EMPTY database. To deliberately replace all
 * website content with this file (never on a live site with real content), run:
 *   SEED_FORCE=true npx prisma db seed
 */
import { env } from "../src/config/env";
import { hashPassword } from "../src/services/authService";
import { prisma } from "../src/prisma/client";
import { MINISTRY_CONTENT } from "./ministry-content";

const MEDIA = "/media";

const publish = {
  status: "PUBLISHED" as const,
  publishedAt: new Date()
};

const PARISH_RW = "mu Itorero Methodiste Libre mu Rwanda, Paruwasi ya Kicukiro";
const PARISH_EN = "at the Free Methodist Church in Rwanda, Kicukiro Parish";
const CHANNEL = "https://www.youtube.com/@emlrparoissekicukiro";

const settings: Record<string, string> = {
  churchName: "EMLR Kicukiro",
  phone: "+250 788 524 792",
  email: "info@emlrkicukiroparish.org",
  address: "Kicukiro, Kigali, Rwanda",
  sundayService1: "8:00 AM",
  sundayService1Rw: "saa mbiri za mu gitondo",
  sundayService2: "11:30 AM",
  sundayService2Rw: "saa tanu n’igice",
  // Midweek general service (Thursday). Key name kept for compatibility.
  wednesdayService: "6:00 PM",
  wednesdayServiceRw: "saa kumi n’ebyiri z’umugoroba",
  facebook: "https://www.facebook.com/p/EMLR-Kicukiro-100083143130293/",
  instagram: "https://www.instagram.com/emlrkicukiro/",
  youtube: CHANNEL,
  showTestimonials: "false",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5168!2d30.1!3d-1.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNTgnMTIuMCJTIDMwwrAwNicwMC4wIkU!5e0!3m2!1sen!2srw!4v1"
};

// Home slides: each text matches its picture or video.
const slides = [
  {
    imageUrl: `${MEDIA}/2.webp`,
    mediaType: "image",
    title: "Welcome to",
    titleRw: "Murakaza neza muri",
    highlight: "EMLR Kicukiro",
    highlightRw: "EMLR Kicukiro",
    subtitle: "Sunday services at 8:00 AM and 11:30 AM.",
    subtitleRw: "Amateraniro yo ku Cyumweru: saa mbiri za mu gitondo na saa tanu n’igice.",
    cta1: "Weekly programme",
    cta1Rw: "Gahunda y’icyumweru",
    cta1Link: "/amatangazo",
    cta2: "Find us",
    cta2Rw: "Aho duherereye",
    cta2Link: "/about/location"
  },
  {
    imageUrl: `${MEDIA}/church-life.mp4`,
    mediaType: "video",
    title: "Hear the",
    titleRw: "Twumve hamwe",
    highlight: "Word of God",
    highlightRw: "Ijambo ry’Imana",
    subtitle: "Watch sermons and services on EMLR TV.",
    subtitleRw: "Reba inyigisho n’amateraniro kuri EMLR TV.",
    cta1: "EMLR TV",
    cta1Rw: "EMLR TV",
    cta1Link: "/tv",
    cta2: "Announcements",
    cta2Rw: "Amatangazo",
    cta2Link: "/amatangazo"
  },
  {
    imageUrl: `${MEDIA}/community.mp4`,
    mediaType: "video",
    title: "Let us build",
    titleRw: "Dufatanye gukora umurimo w’Imana",
    highlight: "God’s house",
    highlightRw: "twubaka Urusengero",
    subtitle: "Support the Kicukiro Parish church building project.",
    subtitleRw: "Shyigikira umushinga wo kubaka itorero rya Paruwasi ya Kicukiro.",
    cta1: "Donate",
    cta1Rw: "Donate",
    cta1Link: "/give?purpose=fundraising",
    cta2: "Join us",
    cta2Rw: "Fatanya natwe",
    cta2Link: "/volunteer"
  }
];

const events = [1, 2, 3].map((day) => ({
  title: "Conference General Assembly",
  titleRw: "Inama Nkuru ya Konferanse",
  description: "Three-day General Assembly of the Conference.",
  descriptionRw: "Inama Nkuru ya Konferanse y’iminsi itatu.",
  date: new Date(`2026-10-${24 + day}T00:00:00.000Z`),
  time: `Day ${day} of 3`,
  timeRw: `Umunsi wa ${day} muri 3`,
  location: null,
  locationRw: null
}));

const news = [
  {
    title: "Joy at the Praise and Worship Concert",
    titleRw: "Ibyishimo mu Giterane cyo Kuramya no Guhimbaza",
    content:
      "Kicukiro Parish held a praise and worship concert full of joy, music and thanksgiving to God.",
    contentRw:
      "Paruwasi ya Kicukiro yagize igiterane cyo kuramya no guhimbaza Imana cyuzuyemo ibyishimo n’indirimbo.",
    date: new Date("2025-05-10T00:00:00.000Z"),
    imageUrl: `${MEDIA}/chu.webp`
  },
  {
    title: "Families Married Before God and the Law",
    titleRw: "Imiryango Yasezeranye Imbere y’Imana n’Amategeko",
    content:
      "At Kicukiro Parish, couples who were living together without marriage were officially married in a blessed ceremony.",
    contentRw:
      "Muri Paruwasi ya Kicukiro, abashakanye bari batarasezerana basezeranye imbere y’Imana n’imbere y’amategeko.",
    date: new Date("2023-07-15T00:00:00.000Z"),
    imageUrl: `${MEDIA}/imi.webp`
  },
  {
    title: "Family Week at Kicukiro Parish",
    titleRw: "Icyumweru cy’Umuryango muri Paruwasi ya Kicukiro",
    content: "Kicukiro Parish celebrated a week dedicated to strengthening families in faith and love.",
    contentRw: "Paruwasi ya Kicukiro yizihije icyumweru cyahariwe gukomeza ingo mu kwizera no mu rukundo.",
    date: new Date("2023-01-01T00:00:00.000Z"),
    imageUrl: `${MEDIA}/ch.webp`
  }
];

const stats = [
  { number: "1345+", label: "Church Members", labelRw: "Abakristo", sortOrder: 0 },
  { number: "15+", label: "Ministries", labelRw: "Ibyiciro", sortOrder: 1 },
  { number: "11+", label: "Weekly Gatherings", labelRw: "Amateraniro", sortOrder: 2 },
  { number: "25+", label: "Cell Groups", labelRw: "Amatsinda", sortOrder: 3 }
];

const people = [
  {
    name: "Rev Ndagijimana Jean Baptiste",
    position: "Senior Pastor",
    positionRw: "Umushumba Mukuru",
    imageUrl: `${MEDIA}/pastor.webp`,
    team: "NATIONAL" as const,
    sortOrder: 0
  },
  { name: "Rev Dr. Benjamin Rutimirwa", position: "", imageUrl: `${MEDIA}/ben.webp`, team: "PARISH" as const, sortOrder: 0 },
  { name: "Rev Bimenyimana Yvonne", position: "", imageUrl: `${MEDIA}/profile.webp`, team: "PARISH" as const, sortOrder: 1 },
  { name: "Rev Frida Uwanyuze", position: "", imageUrl: `${MEDIA}/profile.webp`, team: "PARISH" as const, sortOrder: 2 }
];

const gallery = [
  { file: "chu.webp", caption: "Sunday worship", captionRw: "Amateraniro yo ku Cyumweru" },
  { file: "narada.webp", caption: "Narada Choir", captionRw: "Korali Narada" },
  { file: "imi.webp", caption: "Wedding ceremony", captionRw: "Umuhango wo gusezerana" },
  { file: "bg.webp", caption: "Our church", captionRw: "Itorero ryacu" },
  { file: "bg2.webp", caption: "Worship", captionRw: "Kuramya" },
  { file: "bg5.webp", caption: "Special service", captionRw: "Amateraniro yihariye" },
  { file: "ch.webp", caption: "Fellowship", captionRw: "Gusabana" },
  { file: "chur.webp", caption: "Congregation", captionRw: "Abakristo" },
  { file: "church.webp", caption: "Place of worship", captionRw: "Aho dusengera" },
  { file: "iby.webp", caption: "Ibyiringiro Choir", captionRw: "Korali Ibyiringiro" }
].map((g, i) => ({
  imageUrl: `${MEDIA}/${g.file}`,
  alt: g.caption,
  altRw: g.captionRw,
  caption: g.caption,
  captionRw: g.captionRw,
  sortOrder: i
}));

const giving = [
  {
    purposeKey: "offerings",
    purposeName: "Offerings & Tithes",
    purposeNameRw: "Amaturo n’Icyacumi",
    mtnNumber: null,
    momoCode: "006361",
    airtelNumber: "0734 567 890",
    mobileName: "EMLR Kicukiro - Offerings",
    bankName: "Bank of Kigali",
    accountName: "EMLR Kicukiro - Offerings",
    accountNumber: "00040-06945775-07",
    swift: "BKIGRWRW",
    sortOrder: 0
  },
  {
    purposeKey: "fundraising",
    purposeName: "Church Building Fund",
    purposeNameRw: "Ikigega cyo Kubaka Itorero",
    mtnNumber: "0783 215 463",
    airtelNumber: "0732 154 789",
    mobileName: "EMLR Kicukiro - Building Fund",
    bankName: "Bank of Kigali",
    accountName: "EMLR Kicukiro - Building Fund",
    accountNumber: "00040-06945778-09",
    swift: "BKIGRWRW",
    sortOrder: 1
  },
  {
    purposeKey: "development",
    purposeName: "Development Fund",
    purposeNameRw: "Ikigega cy’Iterambere",
    mtnNumber: "0785 478 965",
    airtelNumber: "0735 478 123",
    mobileName: "EMLR Kicukiro - Development",
    bankName: "Equity Bank",
    accountName: "EMLR Kicukiro - Development",
    accountNumber: "10354006945775",
    swift: "EQBLRWRW",
    sortOrder: 2
  },
  {
    purposeKey: "social",
    purposeName: "Social Ministry",
    purposeNameRw: "Imibereho Myiza",
    mtnNumber: "0789 632 541",
    airtelNumber: "0739 632 874",
    mobileName: "EMLR Kicukiro - Social Ministry",
    bankName: "Bank of Kigali",
    accountName: "EMLR Kicukiro - Social Ministry",
    accountNumber: "00040-06945779-10",
    swift: "BKIGRWRW",
    sortOrder: 3
  },
  {
    purposeKey: "other",
    purposeName: "Other Purposes",
    purposeNameRw: "Izindi Mpamvu",
    mtnNumber: null,
    momoCode: "006361",
    airtelNumber: "0734 567 890",
    mobileName: "EMLR Kicukiro - General",
    bankName: "Bank of Kigali",
    accountName: "EMLR Kicukiro - General",
    accountNumber: "00040-06945775-07",
    swift: "BKIGRWRW",
    sortOrder: 4
  }
];

/** Weekly programme (from the parish "AMATANGAZO" slides). Managed in Dashboard → Weekly programme. */
const PLACE = { location: "EMLR Kicukiro", locationRw: "EMLR Kicukiro" };
const schedule = [
  { title: "First Sunday Service", titleRw: "Iteraniro rya mbere", category: "service", days: [0], startTime: "08:00", endTime: "11:00", ...PLACE, sortOrder: 0 },
  { title: "Second Sunday Service", titleRw: "Iteraniro rya kabiri", category: "service", days: [0], startTime: "11:30", endTime: "13:15", ...PLACE, sortOrder: 1 },
  { title: "Morning Devotion", titleRw: "Amasengesho ya mu gitondo (Nibature)", category: "prayer", days: [1, 2, 3, 4, 5, 6], startTime: "05:00", endTime: "06:00", ministrySlug: "prayer-ministry", ...PLACE, sortOrder: 0 },
  { title: "General Prayer: Fasting", titleRw: "Amasengesho rusange: Kwiyiriza ubusa", category: "prayer", days: [2], startTime: "09:00", endTime: "15:00", ministrySlug: "prayer-ministry", ...PLACE, sortOrder: 1 },
  { title: "Women's Prayer", titleRw: "Amasengesho y’Abari n’Abategarugori", category: "prayer", days: [4], startTime: "09:00", endTime: "15:00", ministrySlug: "women-fellowship", ...PLACE, sortOrder: 1 },
  { title: "General Service", titleRw: "Amateraniro rusange", category: "service", days: [4], startTime: "18:00", endTime: "20:00", ...PLACE, sortOrder: 2 }
];

/**
 * Departments (used by the "Ibyo dukora" menu): evangelism = Ivugabutumwa,
 * social = Imibereho myiza, development = Iterambere, education = Uburezi.
 */
type MinistrySeed = {
  slug: string;
  category: "evangelism" | "social" | "development" | "education";
  name: string;
  nameRw: string;
  shortDescription: string;
  shortDescriptionRw: string;
  body: string;
  bodyRw: string;
  image: string;
  youtubeUrl?: string;
  featuredOnHome?: boolean;
  homeOrder?: number;
};

const choir = (
  slug: string,
  name: string,
  rwName: string,
  image: string,
  extraEn: string,
  extraRw: string,
  home?: number
): MinistrySeed => ({
  slug,
  category: "evangelism",
  name,
  nameRw: rwName,
  shortDescription: `${name} serves God through song ${PARISH_EN}.`,
  shortDescriptionRw: `${rwName} ni korali ikorera umurimo w’Imana ${PARISH_RW}.`,
  body: `${name} serves God through song ${PARISH_EN}. ${extraEn}`,
  bodyRw: `${rwName} ni korali ikorera umurimo w’Imana ${PARISH_RW}. ${extraRw}`,
  image,
  youtubeUrl: CHANNEL,
  featuredOnHome: home !== undefined,
  homeOrder: home ?? 0
});

const ministries: MinistrySeed[] = [
  choir(
    "ibyiringiro-choir",
    "Ibyiringiro Choir",
    "Korali Ibyiringiro",
    "ibyiri.webp",
    "Through its songs it leads the church in worship and shares the hope we have in Christ.",
    "Binyuze mu ndirimbo, iyobora itorero mu kuramya kandi ikamamaza ibyiringiro dufite muri Kristo.",
    0
  ),
  choir(
    "narada-choir",
    "Narada Choir",
    "Korali Narada",
    "narada.webp",
    "Its praise and worship songs help believers draw near to God.",
    "Indirimbo zayo zo kuramya no guhimbaza zifasha abakristo kwegera Imana.",
    1
  ),
  {
    slug: "reverence-worship-team",
    category: "evangelism",
    name: "Reverence Worship Team",
    nameRw: "Itsinda ry’Abaramyi Reverence",
    shortDescription: "Reverence Worship Team leads the church in praise and worship during services.",
    shortDescriptionRw: "Itsinda ry’Abaramyi Reverence riyobora itorero mu kuramya no guhimbaza Imana mu guterana kwera.",
    body: `Reverence Worship Team serves ${PARISH_EN}, leading the congregation in praise and worship.`,
    bodyRw: `Itsinda ry’Abaramyi Reverence rikorera umurimo w’Imana ${PARISH_RW}, riyobora itorero mu kuramya no guhimbaza Imana.`,
    image: "bg2.webp",
    youtubeUrl: CHANNEL,
    featuredOnHome: true,
    homeOrder: 2
  },
  choir(
    "fruta-melody",
    "Fruta Melody Choir",
    "Korali Fruta Melody",
    "youth.webp",
    "It is a youth choir that praises God and encourages young people to follow Jesus.",
    "Ni korali y’urubyiruko ihimbaza Imana kandi igashishikariza urubyiruko gukurikira Yesu.",
    3
  ),
  choir(
    "maranata-choir",
    "Maranata Choir",
    "Korali Maranata",
    "abana.webp",
    "It is a children’s choir that teaches children to praise God with joy.",
    "Ni korali y’abana yigisha abana guhimbaza Imana bishimye."
  ),
  {
    slug: "men-fellowship",
    category: "social",
    name: "Men Fellowship",
    nameRw: "Abagabo",
    shortDescription: "Men of Kicukiro Parish meet to pray, study God’s Word and support one another.",
    shortDescriptionRw: "Abagabo bo muri Paruwasi ya Kicukiro bahurira hamwe mu gusenga, kwiga Ijambo ry’Imana no gufashanya.",
    body: "Men of Kicukiro Parish meet to pray, study God’s Word and support one another as they serve God in their homes, the church and the community.",
    bodyRw: "Abagabo bo muri Paruwasi ya Kicukiro bahurira hamwe mu gusenga, kwiga Ijambo ry’Imana no gufashanya, kugira ngo bakorere Imana mu ngo zabo, mu itorero no mu muryango nyarwanda.",
    image: "church.webp"
  },
  {
    slug: "women-fellowship",
    category: "social",
    name: "Women Fellowship",
    nameRw: "Abagore",
    shortDescription: "Women of Kicukiro Parish meet to pray, study God’s Word and serve the church.",
    shortDescriptionRw: "Abagore bo muri Paruwasi ya Kicukiro bahurira hamwe mu gusenga, kwiga Ijambo ry’Imana no gukorera itorero.",
    body: "Women of Kicukiro Parish meet to pray, study God’s Word, support one another and serve the church with their gifts.",
    bodyRw: "Abagore bo muri Paruwasi ya Kicukiro bahurira hamwe mu gusenga, kwiga Ijambo ry’Imana, gufashanya no gukorera itorero bakoresheje impano zabo.",
    image: "ch.webp"
  },
  {
    slug: "family-commission",
    category: "social",
    name: "Family Commission",
    nameRw: "Komisiyo y’Umuryango",
    shortDescription: "The Family Commission helps couples and families grow strong in faith.",
    shortDescriptionRw: "Komisiyo y’Umuryango ifasha ingo n’imiryango gukomera mu kwizera.",
    body: "The Family Commission walks with couples and families through teaching, counselling and family events.",
    bodyRw: "Komisiyo y’Umuryango iba hafi y’ingo n’imiryango binyuze mu nyigisho, inama n’ibikorwa by’umuryango.",
    image: "fam.webp",
    featuredOnHome: true,
    homeOrder: 4
  },
  {
    slug: "evangelism-team",
    category: "social",
    name: "Cell Groups",
    nameRw: "Amatsinda",
    shortDescription: "Cell groups bring believers together to pray, study the Bible and share the Gospel.",
    shortDescriptionRw: "Amatsinda ahuza abakristo kugira ngo basengere hamwe, bige Bibiliya kandi bamamaze Ubutumwa Bwiza.",
    body: "Cell groups bring believers who live near each other together to pray, study the Bible, care for one another and share the Gospel.",
    bodyRw: "Amatsinda ahuza abakristo baturanye kugira ngo basengere hamwe, bige Bibiliya, bitaneho kandi bamamaze Ubutumwa Bwiza.",
    image: "bg5.webp"
  },
  {
    slug: "ict-technical-team",
    category: "development",
    name: "ICT Team",
    nameRw: "Itsinda rya ICT",
    shortDescription: "The ICT team runs sound, video and live streaming for church services.",
    shortDescriptionRw: "Itsinda rya ICT ritunganya amajwi, amashusho n’ibiganiro bitambuka kuri interineti.",
    body: "The ICT team makes sure sound, video and live streaming work well during every service.",
    bodyRw: "Itsinda rya ICT rituma amajwi, amashusho n’ibiganiro bitambuka kuri interineti bigenda neza mu materaniro yose.",
    image: "chur.webp"
  },
  {
    slug: "protocol-team",
    category: "development",
    name: "Protocol Team",
    nameRw: "Itsinda rya Protocole",
    shortDescription: "The protocol team welcomes guests and keeps services running in order.",
    shortDescriptionRw: "Itsinda rya Protocole ryakira abashyitsi kandi rigafasha amateraniro kugenda neza.",
    body: "The protocol team welcomes visitors, guides members to their seats and helps every service run in good order.",
    bodyRw: "Itsinda rya Protocole ryakira abashyitsi, ryereka abakristo aho bicara kandi rigafasha amateraniro kugenda neza.",
    image: "chu.webp"
  },
  {
    slug: "prayer-ministry",
    category: "development",
    name: "Prayer Team",
    nameRw: "Itsinda ry’Amasengesho",
    shortDescription: "The prayer team prays for the church, families and the nation.",
    shortDescriptionRw: "Itsinda ry’Amasengesho risengera itorero, imiryango n’igihugu.",
    body: "The prayer team gathers believers to pray for the church, for families, for those in need and for the nation.",
    bodyRw: "Itsinda ry’Amasengesho rihuza abakristo gusengera itorero, imiryango, abafite ibibazo n’igihugu.",
    image: "imi.webp"
  },
  {
    slug: "church-advisors",
    category: "development",
    name: "Church Advisors",
    nameRw: "Abajyanama b’Itorero",
    shortDescription: "Church advisors support the parish leadership with wise counsel.",
    shortDescriptionRw: "Abajyanama b’Itorero bagira inama ubuyobozi bwa Paruwasi.",
    body: "Church advisors support the parish leadership with counsel so that God’s work is done well.",
    bodyRw: "Abajyanama b’Itorero bagira inama ubuyobozi bwa Paruwasi kugira ngo umurimo w’Imana ukorwe neza.",
    image: "pastor.webp"
  },
  {
    slug: "youth-ministry",
    category: "education",
    name: "Youth",
    nameRw: "Urubyiruko",
    shortDescription: "Young people of Kicukiro Parish grow together in faith and serve God.",
    shortDescriptionRw: "Urubyiruko rwa Paruwasi ya Kicukiro ruhurira hamwe kugira ngo rukure mu kwizera kandi rukorere Imana.",
    body: "Young people of Kicukiro Parish meet for teaching, worship and service, growing together as followers of Jesus.",
    bodyRw: "Urubyiruko rwa Paruwasi ya Kicukiro ruhurira hamwe mu nyigisho, kuramya no gukora umurimo w’Imana, rukura mu kwizera.",
    image: "youth.webp"
  },
  {
    slug: "children-ministry",
    category: "education",
    name: "Sunday School",
    nameRw: "Ishuri ryo ku Cyumweru",
    shortDescription: "Sunday School teaches children God’s Word in a way they understand.",
    shortDescriptionRw: "Ishuri ryo ku Cyumweru ryigisha abana Ijambo ry’Imana mu buryo bubakwiriye.",
    body: "Every Sunday, children learn God’s Word through lessons, songs and activities suited to their age.",
    bodyRw: "Buri cyumweru, abana biga Ijambo ry’Imana binyuze mu masomo, indirimbo n’ibikorwa bijyanye n’imyaka yabo.",
    image: "abana.webp",
    featuredOnHome: true,
    homeOrder: 5
  }
];

const main = async () => {
  const email = env.seedAdminEmail;
  const password = env.seedAdminPassword;

  let admin = await prisma.user.findUnique({ where: { email } });
  if (!admin) {
    admin = await prisma.user.create({
      data: { email, passwordHash: await hashPassword(password), role: "ADMIN" }
    });
    console.log(`Created admin: ${email}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }
  const adminId = admin.id;
  const owned = { createdById: adminId, ...publish, publishedById: adminId };

  const hasContent = (await prisma.ministry.count()) > 0 || (await prisma.siteSetting.count()) > 0;
  if (hasContent && process.env.SEED_FORCE !== "true") {
    console.log("Content already exists; skipped. Use SEED_FORCE=true to replace it.");
    return;
  }

  await prisma.$transaction([
    prisma.bannerSlide.deleteMany(),
    prisma.banner.deleteMany(),
    prisma.event.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.notice.deleteMany(),
    prisma.scheduleItem.deleteMany(),
    prisma.service.deleteMany(),
    prisma.project.deleteMany(),
    prisma.ministry.deleteMany(),
    prisma.person.deleteMany(),
    prisma.galleryItem.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.stat.deleteMany(),
    prisma.givingAccount.deleteMany(),
    prisma.siteSetting.deleteMany()
  ]);

  await prisma.siteSetting.createMany({
    data: Object.entries(settings).map(([key, value]) => ({ key, value }))
  });

  await prisma.banner.create({
    data: {
      ...owned,
      slides: {
        create: slides.map((s, order) => ({ ...s, order, duration: 8000, hasBlur: true }))
      }
    }
  });

  await prisma.event.createMany({ data: events.map((e) => ({ ...e, ...owned })) });
  await prisma.announcement.createMany({ data: news.map((n) => ({ ...n, ...owned })) });
  await prisma.stat.createMany({ data: stats.map((s) => ({ ...s, ...owned })) });
  await prisma.person.createMany({ data: people.map((p) => ({ ...p, ...owned })) });
  await prisma.galleryItem.createMany({ data: gallery.map((g) => ({ ...g, ...owned })) });
  await prisma.givingAccount.createMany({ data: giving.map((g) => ({ ...g, ...owned })) });
  await prisma.scheduleItem.createMany({ data: schedule.map((i) => ({ ...i, ...owned })) });

  await prisma.ministry.createMany({
    data: ministries.map(({ image, ...m }, sortOrder) => {
      const rich = MINISTRY_CONTENT[m.slug];
      const curly = (text: string) => text.replace(/'/g, "\u2019");
      return {
      ...m,
      ...(rich ? { body: curly(rich.body), bodyRw: curly(rich.bodyRw) } : {}),
      heroImageUrl: `${MEDIA}/${rich?.image ?? image}`,
      // Designed backgrounds are only used as the hero; the page shows the "What we do" list instead of a photo.
      aboutImageUrl: rich?.image ? null : `${MEDIA}/${image}`,
      youtubeUrl: m.youtubeUrl ?? null,
      featuredOnHome: Boolean(m.featuredOnHome),
      homeOrder: m.homeOrder ?? 0,
      sortOrder,
      ...owned
      };
    })
  });



  console.log("Seed completed with website content.");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
