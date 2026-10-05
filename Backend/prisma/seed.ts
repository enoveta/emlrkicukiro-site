import { env } from "../src/config/env";
import { hashPassword } from "../src/services/authService";
import { prisma } from "../src/prisma/client";

const MEDIA = "http://localhost:5050/media";

const publish = {
  status: "PUBLISHED" as const,
  publishedAt: new Date()
};

const main = async () => {
  const email = env.seedAdminEmail;
  const password = env.seedAdminPassword;

  let admin = await prisma.user.findUnique({ where: { email } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        role: "ADMIN"
      }
    });
    console.log(`Created admin: ${email}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }

  const adminId = admin.id;

  // Clear content for idempotent re-seed (keep users)
  await prisma.bannerSlide.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.event.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.service.deleteMany();
  await prisma.project.deleteMany();
  await prisma.ministry.deleteMany();
  await prisma.person.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.givingAccount.deleteMany();
  await prisma.siteSetting.deleteMany();

  // Site settings
  const settings: Record<string, string> = {
    churchName: "EMRL Kicukiro",
    phone: "+250 788 524 792",
    email: "info@emlrkicukiro.rw",
    address: "Kicukiro, Kigali, Rwanda",
    sundayService1: "8:00 AM",
    sundayService2: "10:30 AM",
    wednesdayService: "6:00 PM",
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    mapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5168!2d30.1!3d-1.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNTgnMTIuMCJTIDMwwrAwNicwMC4wIkU!5e0!3m2!1sen!2srw!4v1"
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.create({ data: { key, value } });
  }

  // Banner / Hero
  await prisma.banner.create({
    data: {
      createdById: adminId,
      ...publish,
      publishedById: adminId,
      slides: {
        create: [
          {
            order: 0,
            mediaType: "image",
            imageUrl: `${MEDIA}/2.jpg`,
            title: "Welcome to",
            highlight: "EMRL Kicukiro",
            subtitle: "A loving community of faith serving God in Kicukiro",
            titleRw: "Murakaza neza muri",
            highlightRw: "EMRL Kicukiro",
            subtitleRw: "Umuryango wuzuye urukundo w’abizera bakorera Imana i Kicukiro",
            cta1: "Learn About Us",
            cta1Rw: "Menya Abo Turi Bo",
            cta1Link: "/about",
            cta2: "Visit Us",
            cta2Rw: "Dusure",
            cta2Link: "/about/location",
            duration: 8000,
            hasBlur: true
          },
          {
            order: 1,
            mediaType: "image",
            imageUrl: `${MEDIA}/bg5.jpeg`,
            title: "Join Our",
            highlight: "Worship Services",
            subtitle: "Sunday services at 8:00 AM and 10:30 AM",
            titleRw: "Witabire",
            highlightRw: "Amasengesho Yacu",
            subtitleRw: "Amasengesho ya Ku cyumweru saa 2:00 n’saa 4:30 za mu gitondo",
            cta1: "Service Times",
            cta1Rw: "Amasaha y’Amasengesho",
            cta1Link: "/events",
            cta2: "Sermon Archive",
            cta2Rw: "Amafoto n’Inyigisho",
            cta2Link: "/media/gallery",
            duration: 8000,
            hasBlur: true
          },
          {
            order: 2,
            mediaType: "image",
            imageUrl: `${MEDIA}/bg1.gif`,
            title: "Be Part of Our",
            highlight: "Community",
            subtitle: "Connect with others through our various ministries",
            titleRw: "Ba umwe mu",
            highlightRw: "Muryango Wacu",
            subtitleRw: "Huza n’abandi binyuze mu buhumvikane butandukanye",
            cta1: "Our Ministries",
            cta1Rw: "Ubuhumvikane Bwacu",
            cta1Link: "/ministries",
            cta2: "Get Involved",
            cta2Rw: "Witabire",
            cta2Link: "/ministries",
            duration: 8000,
            hasBlur: true
          },
          {
            order: 3,
            mediaType: "video",
            imageUrl: `${MEDIA}/bible.mp4`,
            title: "Experience Our",
            highlight: "Church Life",
            subtitle: "See what God is doing in our community",
            titleRw: "Menya",
            highlightRw: "Ubuzima bw’Itorero",
            subtitleRw: "Reba ibyo Imana ikora mu muryango wacu",
            cta1: "Watch",
            cta1Rw: "Reba",
            cta1Link: "/media/tv",
            cta2: "Upcoming Events",
            cta2Rw: "Ibirori Biri Imbere",
            cta2Link: "/events",
            duration: 15000,
            hasBlur: true
          }
        ]
      }
    }
  });

  // Events
  const events = [
    {
      title: "Family Week",
      titleRw: "Icyumweru cy’Imiryango",
      description: "A special week dedicated to strengthening family bonds in faith, love, and community.",
      descriptionRw:
        "Icyumweru cyihariye cyagenewe gukomeza imiryango mu kwizera, mu rukundo, no mu muryango w’itorero.",
      date: new Date("2025-10-15T00:00:00.000Z"),
      time: "All week Event",
      timeRw: "Ibirori by’icyumweru cyose",
      location: "EMLR Kicukiro",
      locationRw: "EMLR Kicukiro"
    },
    {
      title: "Praise and Worship Concert",
      titleRw: "Konserti y’Amasengesho n’Indirimbo",
      description: "An uplifting evening of praise and worship music with our choirs and worship teams.",
      descriptionRw:
        "Igiloro gishimishije cy’amasengesho n’indirimbo hamwe n’amakorali n’amakipe y’amasengesho.",
      date: new Date("2025-11-18T00:00:00.000Z"),
      time: "All day event",
      timeRw: "Ibirori by’umunsi wose",
      location: "EMLR Kicukiro",
      locationRw: "EMLR Kicukiro"
    },
    {
      title: "Conference Meeting",
      titleRw: "Inama y’Itorero",
      description: "Three-day conference gathering for fellowship, teaching, and church leadership.",
      descriptionRw: "Inama y’iminsi itatu yo gufatanya, kwiga, n’ubuyobozi bw’itorero.",
      date: new Date("2025-09-25T00:00:00.000Z"),
      time: "Three day Event",
      timeRw: "Ibirori by’iminsi itatu",
      location: "KIGALI Conference",
      locationRw: "Inama ya Kigali"
    }
  ];
  for (const event of events) {
    await prisma.event.create({
      data: { ...event, createdById: adminId, ...publish, publishedById: adminId }
    });
  }

  // Announcements / News
  const news = [
    {
      title: "Joyful Moments at the Worship and Praise Concert",
      titleRw: "Ibyishimo byabonetse muri Konserti y’Amasengesho",
      content:
        "Kicukiro Parish of the Free Methodist Church in Rwanda experienced an uplifting worship and praise concert filled with music, joy, and spiritual inspiration.",
      contentRw:
        "Paruwasi ya Kicukiro y’Itorero rya Free Methodist mu Rwanda yabonye konserti y’amasengesho n’indirimbo yuzuye umunezero n’ubuhumvikane mu bya mwuka.",
      date: new Date("2025-05-10T00:00:00.000Z"),
      imageUrl: `${MEDIA}/chu.png`
    },
    {
      title: "Celebrating Family Week at Kicukiro Parish",
      titleRw: "Kwizihiza Icyumweru cy’Imiryango muri Paruwasi ya Kicukiro",
      content:
        "Kicukiro Parish of the Free Methodist Church in Rwanda honored families during a special week dedicated to strengthening family bonds in faith, love, and community.",
      contentRw:
        "Paruwasi ya Kicukiro yubahye imiryango mu cyumweru cyihariye cyagenewe gukomeza imibanire mu kwizera, mu rukundo, no mu muryango.",
      date: new Date("2023-01-01T00:00:00.000Z"),
      imageUrl: `${MEDIA}/chu.webp`
    },
    {
      title: "Families United in Faith and Law at Kicukiro Free Methodist Church",
      titleRw: "Imiryango yahuze mu kwizera no mu mategeko muri EMRL Kicukiro",
      content:
        "At Kicukiro Parish of the Free Methodist Church in Rwanda, several families who had been living together without a legal or spiritual marriage were officially united in a blessed ceremony.",
      contentRw:
        "Muri Paruwasi ya Kicukiro, imiryango myinshi yari ibana nta shyingiranwa ryemewe cyangwa rya mwuka yahujejwe mu muhango wahawe umugisha.",
      date: new Date("2023-07-15T00:00:00.000Z"),
      imageUrl: `${MEDIA}/imi.png`
    }
  ];
  for (const item of news) {
    await prisma.announcement.create({
      data: { ...item, createdById: adminId, ...publish, publishedById: adminId }
    });
  }

  // Stats
  const stats = [
    { number: "1500+", label: "Church Members", labelRw: "Abizera b’Itorero", sortOrder: 0 },
    { number: "10+", label: "Ministries", labelRw: "Ubuhumvikane", sortOrder: 1 },
    { number: "5+", label: "Weekly Services", labelRw: "Amasengesho ya buri cyumweru", sortOrder: 2 },
    { number: "25+", label: "Evangilical Team", labelRw: "Ikipe y’Ubutumwa", sortOrder: 3 }
  ];
  for (const stat of stats) {
    await prisma.stat.create({
      data: { ...stat, createdById: adminId, ...publish, publishedById: adminId }
    });
  }

  // Testimonials
  const testimonials = [
    {
      text: "EMRL Kicukiro has been a spiritual home for my family. The preaching is biblical, the worship is uplifting, and the community is loving and supportive. We've grown so much in our faith here.",
      textRw:
        "EMRL Kicukiro yabaye inzu y’umwuka ku muryango wanjye. Inyigisho zishingiye ku Byanditswe, amasengesho arashimisha, n’umuryango urakunda kandi urashyigikira. Twakuriye cyane mu kwizera hano.",
      author: "Marie Uwase",
      role: "Church Member since 2018",
      roleRw: "Umwizera kuva mu 2018",
      imageUrl: `${MEDIA}/logo1.png`,
      sortOrder: 0
    },
    {
      text: "As a young adult, I've found a place where I can ask questions, grow in my understanding of God, and serve alongside others who genuinely care about me. The youth ministry has been transformative for me.",
      textRw:
        "Nk’umuntu mukuru muto, nabonye aho nashobora kubaza, gukura mu gusobanukirwa Imana, no gukorera hamwe n’abandi banyitaho koko. Ubuhumvikane bw’urubyiruko bwahinduye ubuzima bwanjye.",
      author: "Jean Paul",
      role: "Youth Group Member",
      roleRw: "Umunyamuryango w’Urubyiruko",
      imageUrl: `${MEDIA}/logo1.png`,
      sortOrder: 1
    },
    {
      text: "When we moved to Kigali, we prayed to find a church that would feel like family. God answered that prayer through EMRL Kicukiro. The teaching is solid and the people have become our closest friends.",
      textRw:
        "Igihe twimukiye i Kigali, twasabye Imana kudushakira itorero rizatubera umuryango. Imana yasubije uwo musengi binyuze muri EMRL Kicukiro. Inyigisho ni nziza, abantu bakaba inshuti zacu zo hafi.",
      author: "Grace and David",
      role: "New Members",
      roleRw: "Abizera bashya",
      imageUrl: `${MEDIA}/logo1.png`,
      sortOrder: 2
    }
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: { ...t, createdById: adminId, ...publish, publishedById: adminId }
    });
  }

  // People / Leadership
  const people = [
    {
      name: "Rev Ndagijimana Jean Baptiste",
      position: "Senior Pastor",
      positionRw: "Umupastori Mukuru",
      imageUrl: `${MEDIA}/pastor.png`,
      team: "NATIONAL" as const,
      sortOrder: 0
    },
    {
      name: "Rev Dr. Benjamin Rutimirwa",
      position: "",
      imageUrl: `${MEDIA}/ben.png`,
      team: "PARISH" as const,
      sortOrder: 0
    },
    {
      name: "Rev Bimenyimana Yvonne",
      position: "",
      imageUrl: `${MEDIA}/profile.png`,
      team: "PARISH" as const,
      sortOrder: 1
    },
    {
      name: "Rev Frida Uwanyuze",
      position: "",
      imageUrl: `${MEDIA}/profile.png`,
      team: "PARISH" as const,
      sortOrder: 2
    }
  ];
  for (const person of people) {
    await prisma.person.create({
      data: { ...person, createdById: adminId, ...publish, publishedById: adminId }
    });
  }

  // Gallery
  const gallery = [
    { imageUrl: `${MEDIA}/chu.webp`, alt: "Church service", caption: "Sunday worship service", sortOrder: 0 },
    { imageUrl: `${MEDIA}/narada.jpg`, alt: "Church event", caption: "Community gathering", sortOrder: 1 },
    { imageUrl: `${MEDIA}/imi.png`, alt: "Church activity", caption: "Prayer session", sortOrder: 2 },
    { imageUrl: `${MEDIA}/bg.jpg`, alt: "Church building", caption: "Our beautiful church", sortOrder: 3 },
    { imageUrl: `${MEDIA}/bg1.gif`, alt: "Church animation", caption: "Celebration", sortOrder: 4 },
    { imageUrl: `${MEDIA}/bg2.jpg`, alt: "Church background", caption: "Church interior", sortOrder: 5 },
    { imageUrl: `${MEDIA}/bg5.jpeg`, alt: "Church event", caption: "Special ceremony", sortOrder: 6 },
    { imageUrl: `${MEDIA}/chu.png`, alt: "Church logo", caption: "Church symbol", sortOrder: 7 },
    { imageUrl: `${MEDIA}/ch.webp`, alt: "Church community", caption: "Fellowship", sortOrder: 8 },
    { imageUrl: `${MEDIA}/chur.webp`, alt: "Church gathering", caption: "Congregation", sortOrder: 9 },
    { imageUrl: `${MEDIA}/church.jpg`, alt: "Church building", caption: "Place of worship", sortOrder: 10 },
    { imageUrl: `${MEDIA}/iby.jpg`, alt: "Church activity", caption: "Community outreach", sortOrder: 11 }
  ];
  for (const item of gallery) {
    await prisma.galleryItem.create({
      data: { ...item, createdById: adminId, ...publish, publishedById: adminId }
    });
  }

  // Giving accounts
  const giving = [
    {
      purposeKey: "offerings",
      purposeName: "Offerings & Tithes",
      purposeNameRw: "Amaturo n’Icyacumi",
      mtnNumber: "0788 524 792",
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
      purposeNameRw: "Ubuhumvikane bw’Imibereho",
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
      mtnNumber: "0788 524 792",
      airtelNumber: "0734 567 890",
      mobileName: "EMLR Kicukiro - General",
      bankName: "Bank of Kigali",
      accountName: "EMLR Kicukiro - General",
      accountNumber: "00040-06945775-07",
      swift: "BKIGRWRW",
      sortOrder: 4
    }
  ];
  for (const account of giving) {
    await prisma.givingAccount.create({
      data: { ...account, createdById: adminId, ...publish, publishedById: adminId }
    });
  }

  // Ministries
  const ministries = [
    {
      slug: "ibyiringiro-choir",
      name: "IBYIRINGIRO CHOIR",
      category: "music",
      shortDescription:
        "Join our inspiring choir that leads the congregation in worship through beautiful hymns and songs of praise.",
      body: "The Ibyiringiro Choir is a vibrant community of believers who use their musical gifts to worship God and inspire congregations. Our name \"Ibyiringiro\" means \"Hope\" in Kinyarwanda, reflecting our mission to spread hope through sacred music.\n\nWe welcome singers of all experience levels who are passionate about using their voices to glorify God and edify the church community.",
      heroImageUrl: `${MEDIA}/ibyiri.webp`,
      aboutImageUrl: `${MEDIA}/iby.jpg`,
      scheduleLabel: "Rehearsals weekly — join us in worship",
      youtubeUrl: "https://www.youtube.com/",
      featuredOnHome: true,
      homeOrder: 0,
      sortOrder: 0
    },
    {
      slug: "narada-choir",
      name: "NARADA CHOIR",
      category: "music",
      shortDescription:
        "Be part of our vibrant choir that enhances our worship services with harmonious music and spiritual songs.",
      body: "Narada Choir leads the congregation in spirited praise and worship. Through harmony and dedication, the choir helps create an atmosphere where people encounter God.",
      heroImageUrl: `${MEDIA}/narada.jpg`,
      aboutImageUrl: `${MEDIA}/narada.jpg`,
      scheduleLabel: "Practice sessions announced weekly",
      featuredOnHome: true,
      homeOrder: 1,
      sortOrder: 1
    },
    {
      slug: "reverence-worship-team",
      name: "REVERENCE WORSHIP TEAM",
      category: "music",
      shortDescription:
        "Our dedicated worship team creates an atmosphere of reverence and connection with God through music.",
      body: "The Reverence Worship Team leads contemporary and traditional worship, guiding the church into God's presence every service.",
      heroImageUrl: `${MEDIA}/bg2.jpg`,
      aboutImageUrl: `${MEDIA}/bg2.jpg`,
      featuredOnHome: true,
      homeOrder: 2,
      sortOrder: 2
    },
    {
      slug: "fruta-melody",
      name: "YOUTH MINISTRY / FRUTA MELODY CHOIR",
      category: "youth",
      shortDescription:
        "Engaging programs and activities designed to help young people grow in their faith and build Christian community.",
      body: "Fruta Melody and the Youth Ministry equip young people to follow Jesus, serve the church, and impact their generation.",
      heroImageUrl: `${MEDIA}/youth.webp`,
      aboutImageUrl: `${MEDIA}/youth.webp`,
      featuredOnHome: true,
      homeOrder: 3,
      sortOrder: 3
    },
    {
      slug: "family-commission",
      name: "FAMILY MINISTRY",
      category: "family",
      shortDescription:
        "Supporting and strengthening families through biblical teaching, counseling, and family-focused events.",
      body: "The Family Commission walks with couples and families through teaching, counseling, and fellowship events that strengthen Christian homes.",
      heroImageUrl: `${MEDIA}/fam.jpg`,
      aboutImageUrl: `${MEDIA}/fam.jpg`,
      featuredOnHome: true,
      homeOrder: 4,
      sortOrder: 4
    },
    {
      slug: "children-ministry",
      name: "SUNDAY SCHOOL / MARANATA CHOIR",
      category: "children",
      shortDescription:
        "Biblical education for all ages with classes designed to help everyone grow in their knowledge of Scripture.",
      body: "Our Sunday School and Maranata Choir nurture children in the Word of God through age-appropriate teaching, songs, and activities.",
      heroImageUrl: `${MEDIA}/abana.webp`,
      aboutImageUrl: `${MEDIA}/abana.webp`,
      featuredOnHome: true,
      homeOrder: 5,
      sortOrder: 5
    },
    {
      slug: "men-fellowship",
      name: "Men Fellowship",
      category: "fellowship",
      shortDescription: "Men growing together in faith, leadership, and service.",
      body: "Men Fellowship gathers brothers in Christ for prayer, discipleship, and mutual encouragement as they lead in home, church, and community.",
      heroImageUrl: `${MEDIA}/church.jpg`,
      aboutImageUrl: `${MEDIA}/church.jpg`,
      sortOrder: 6
    },
    {
      slug: "women-fellowship",
      name: "Women Fellowship",
      category: "fellowship",
      shortDescription: "Women united in prayer, fellowship, and ministry.",
      body: "Women Fellowship creates space for sisters in Christ to grow spiritually, support one another, and serve the church with their gifts.",
      heroImageUrl: `${MEDIA}/ch.webp`,
      aboutImageUrl: `${MEDIA}/ch.webp`,
      sortOrder: 7
    },
    {
      slug: "youth-ministry",
      name: "Youth Ministry",
      category: "youth",
      shortDescription: "Helping young people discover and follow Jesus.",
      body: "Youth Ministry offers teaching, fellowship, outreach, and leadership opportunities for teenagers and young adults.",
      heroImageUrl: `${MEDIA}/youth.jpg`,
      aboutImageUrl: `${MEDIA}/youth.webp`,
      sortOrder: 8
    },
    {
      slug: "maranata-choir",
      name: "Maranata Choir",
      category: "music",
      shortDescription: "Children and young voices lifting praise to God.",
      body: "Maranata Choir trains young singers to worship God joyfully and serve in church services and special events.",
      heroImageUrl: `${MEDIA}/abana.webp`,
      aboutImageUrl: `${MEDIA}/abana.webp`,
      sortOrder: 9
    },
    {
      slug: "ict-technical-team",
      name: "ICT Technical Team",
      category: "service",
      shortDescription: "Supporting worship through sound, media, and technology.",
      body: "The ICT Technical Team ensures smooth sound, livestream, and media support for every gathering.",
      heroImageUrl: `${MEDIA}/chur.webp`,
      aboutImageUrl: `${MEDIA}/chur.webp`,
      sortOrder: 10
    },
    {
      slug: "protocol-team",
      name: "Protocol Team",
      category: "service",
      shortDescription: "Welcoming guests and coordinating church hospitality.",
      body: "The Protocol Team greets visitors, ushers congregants, and helps maintain order and warmth in our services.",
      heroImageUrl: `${MEDIA}/chu.webp`,
      aboutImageUrl: `${MEDIA}/chu.webp`,
      sortOrder: 11
    },
    {
      slug: "prayer-ministry",
      name: "Prayer Ministry",
      category: "prayer",
      shortDescription: "Interceding for the church, city, and nations.",
      body: "Prayer Ministry gathers believers to seek God together for personal needs, church vision, and community transformation.",
      heroImageUrl: `${MEDIA}/imi.png`,
      aboutImageUrl: `${MEDIA}/imi.png`,
      sortOrder: 12
    },
    {
      slug: "church-advisors",
      name: "Church Advisors",
      category: "leadership",
      shortDescription: "Wise counsel supporting pastoral leadership.",
      body: "Church Advisors provide guidance and support to pastoral leadership for healthy church governance and mission.",
      heroImageUrl: `${MEDIA}/pastor.png`,
      aboutImageUrl: `${MEDIA}/pastor.png`,
      sortOrder: 13
    },
    {
      slug: "evangelism-team",
      name: "Evangelism Team",
      category: "evangelism",
      shortDescription: "Sharing the gospel in our community and beyond.",
      body: "The Evangelism Team equips and sends believers to proclaim Christ through outreach, visitation, and public witness.",
      heroImageUrl: `${MEDIA}/bg5.jpeg`,
      aboutImageUrl: `${MEDIA}/bg5.jpeg`,
      sortOrder: 14
    }
  ];

  const ministryRw: Record<string, { nameRw: string; shortDescriptionRw: string; bodyRw: string; scheduleLabelRw?: string }> = {
    "ibyiringiro-choir": {
      nameRw: "IKORALI RY’IBYIRINGIRO",
      shortDescriptionRw:
        "Jya mu korali ryacu rishimishije riyobora itorero mu gusenga binyuze mu ndirimbo nziza z’amahoro.",
      bodyRw:
        "Ikorali ry’Ibyiringiro ni umuryango w’abizera bakoresha impano zabo z’umuziki mu gusenga Imana no guhumeka amatorero. Izina \"Ibyiringiro\" rivuga \"Hope\" mu Cyongereza, rigaragaza intego yacu yo kubwiriza ibyiringiro binyuze mu ndirimbo ntagatifu.\n\nDwakira abacuranzi bose, niba ufite uburambe cyangwa utabufite, ariko ukunda gukoresha ijwi ryawe mu guha Imana ikuzo no kubaka itorero.",
      scheduleLabelRw: "Amasomo ya buri cyumweru — witabire mu gusenga"
    },
    "narada-choir": {
      nameRw: "IKORALI RYA NARADA",
      shortDescriptionRw: "Ba umwe mu korali ryacu rishimishije ryongera amasengesho n’indirimbo z’umwuka.",
      bodyRw:
        "Ikorali rya Narada riyobora itorero mu gusenga no mu guhimbaza Imana. Binyuze mu majwi ahuje n’ubwitange, rikafasha kurema umwuka aho abantu bahura n’Imana."
    },
    "reverence-worship-team": {
      nameRw: "IKIPE Y’AMASENGESHO YA REVERENCE",
      shortDescriptionRw: "Ikipe yacu yiyemeje gukora umwuka wo kubahisha Imana no kuyihura binyuze mu muziki.",
      bodyRw:
        "Ikipe y’Amasengesho ya Reverence iyobora amasengesho ya none n’aya kimwe, igana itorero mu maso y’Imana buri gihe."
    },
    "fruta-melody": {
      nameRw: "URUBYIRUKO / IKORALI RYA FRUTA MELODY",
      shortDescriptionRw: "Gahunda n’ibikorwa bifasha urubyiruko gukura mu kwizera no kubaka umuryango w’Abakristo.",
      bodyRw:
        "Fruta Melody n’Ubuhumvikane bw’Urubyiruko bitegura urubyiruko gukurikira Yesu, gukorera itorero, no kugira ingaruka ku gihe cyabo."
    },
    "family-commission": {
      nameRw: "UBUHUMVIKANE BW’IMIRYANGO",
      shortDescriptionRw: "Gushyigikira no gukomeza imiryango binyuze mu nyigisho za Bibiliya, inama, n’ibirori by’imiryango.",
      bodyRw:
        "Komisiyo y’Imiryango igenda n’ababana n’imiryango binyuze mu nyigisho, inama, n’ibirori bikomeza amazu y’Abakristo."
    },
    "children-ministry": {
      nameRw: "ISHURI RY’ICYUMWERU / IKORALI RYA MARANATA",
      shortDescriptionRw: "Uburezi bwa Bibiliya ku myaka yose, bufasha buri wese gukura mu kumenya Ibyanditswe.",
      bodyRw:
        "Ishuri ry’Icyumweru n’Ikorali rya Maranata bigira abana mu Ijambo ry’Imana binyuze mu nyigisho zibakwiriye, indirimbo, n’ibikorwa."
    },
    "men-fellowship": {
      nameRw: "Umuryango w’Abagabo",
      shortDescriptionRw: "Abagabo bakura hamwe mu kwizera, mu buyobozi, no mu gukorera.",
      bodyRw:
        "Umuryango w’Abagabo uhura hamwe mu gusenga, mu kwigisha, no guhumuriza, kugira ngo bayobore neza mu rugo, mu itorero, no mu muryango."
    },
    "women-fellowship": {
      nameRw: "Umuryango w’Abagore",
      shortDescriptionRw: "Abagore bahuje mu gusenga, mu muryango, no mu umurimo.",
      bodyRw:
        "Umuryango w’Abagore utanga umwanya wo gukura mu bya mwuka, gufashanya, no gukorera itorero n’impano zabo."
    },
    "youth-ministry": {
      nameRw: "Ubuhumvikane bw’Urubyiruko",
      shortDescriptionRw: "Gufasha urubyiruko kumenya no gukurikira Yesu.",
      bodyRw:
        "Ubuhumvikane bw’Urubyiruko butanga inyigisho, umuryango, ubutumwa, n’amahirwe y’ubuyobozi ku bato n’urubyiruko."
    },
    "maranata-choir": {
      nameRw: "Ikorali rya Maranata",
      shortDescriptionRw: "Amajwi y’abana n’urubyiruko ahesha Imana ikuzo.",
      bodyRw: "Ikorali rya Maranata ritoza abana gushima Imana n’ibyishimo no gukorera mu masengesho n’ibirori."
    },
    "ict-technical-team": {
      nameRw: "Ikipe ya ICT n’Ubuhanga",
      shortDescriptionRw: "Gushyigikira amasengesho binyuze mu majwi, media, n’ikoranabuhanga.",
      bodyRw:
        "Ikipe ya ICT n’Ubuhanga ituma amajwi, livestream, n’itangazamakuru bikora neza mu mahuriro yose."
    },
    "protocol-team": {
      nameRw: "Ikipe ya Protokole",
      shortDescriptionRw: "Kwakira abashyitsi no gutunganya uburyo bwo kwakira mu itorero.",
      bodyRw:
        "Ikipe ya Protokole ikira abashyitsi, iyobora abizera, kandi ifasha kugira umutekano n’ubushyuhe mu masengesho."
    },
    "prayer-ministry": {
      nameRw: "Ubuhumvikane bwo Gusenga",
      shortDescriptionRw: "Gusabira itorero, umugi, n’amahanga.",
      bodyRw:
        "Ubuhumvikane bwo Gusenga buhura abizera mu gushaka Imana hamwe ku byifuzo byihariye, icyerekezo cy’itorero, n’ivugurura ry’umuryango."
    },
    "church-advisors": {
      nameRw: "Abajyanama b’Itorero",
      shortDescriptionRw: "Inama z’ubwenge zishyigikira ubuyobozi bw’abapastori.",
      bodyRw:
        "Abajyanama b’Itorero batanga inama n’ubushyigikizi ku buyobozi bw’abapastori kugira ngo itorero ribe rifite imitegekere myiza n’umurimo."
    },
    "evangelism-team": {
      nameRw: "Ikipe y’Ubutumwa",
      shortDescriptionRw: "Kubwiriza Inkuru Nziza mu muryango wacu no hanze.",
      bodyRw:
        "Ikipe y’Ubutumwa itegura no kohereza abizera mu kubwiriza Kristo binyuze mu kugera ku bantu, gusura, n’ubuhamya."
    }
  };

  for (const ministry of ministries) {
    await prisma.ministry.create({
      data: {
        ...ministry,
        ...(ministryRw[ministry.slug] || {}),
        createdById: adminId,
        ...publish,
        publishedById: adminId
      }
    });
  }

  // Sample service / sermon
  await prisma.service.create({
    data: {
      serviceTitle: "Sunday Worship",
      topic: "Walking in Faith",
      preacherName: "Rev Ndagijimana Jean Baptiste",
      verse: "Hebrews 11:1",
      date: new Date("2025-05-04T00:00:00.000Z"),
      imageUrl: `${MEDIA}/chu.webp`,
      createdById: adminId,
      ...publish,
      publishedById: adminId
    }
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
