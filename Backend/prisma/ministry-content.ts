/**
 * Full page content for ministries. Body format (editable in the dashboard):
 * paragraphs separated by a blank line; lines starting with "- " become the "What we do" list.
 * `image` replaces weak photos with a designed background (Reverence, Ibyiringiro and Narada keep their photos).
 */
export const MINISTRY_CONTENT: Record<string, { body: string; bodyRw: string; image?: string }> = {
  "fruta-melody": {
    image: "dept-fruta-melody.webp",
    body: `Fruta Melody is the youth choir of Kicukiro Parish. Its members are young people who love God and worship Him through song.

The choir helps young people grow in faith, use their gifts and be an example in the church and in the community.

- Singing in Sunday services and church gatherings
- Song and voice rehearsals
- Praying and studying God's Word together
- Sharing the Gospel through music`,
    bodyRw: `Korali Fruta Melody ni korali y'urubyiruko rwa Paruwasi ya Kicukiro. Abayigize ni urubyiruko rukunda Imana kandi ruyiramya binyuze mu ndirimbo.

Ifasha urubyiruko gukura mu kwizera, gukoresha impano zarwo no kuba intangarugero mu itorero no mu muryango nyarwanda.

- Kuririmba mu materaniro yo ku Cyumweru no mu biterane
- Imyitozo y'indirimbo n'amajwi
- Gusenga no kwiga Ijambo ry'Imana hamwe
- Kwamamaza Ubutumwa Bwiza binyuze mu ndirimbo`
  },
  "maranata-choir": {
    image: "dept-maranata-choir.webp",
    body: `Maranata Choir is the children's choir of Kicukiro Parish. It teaches children to praise God with joy, to love His Word and to use their gifts from a young age.

- Singing in services and children's activities
- Learning songs and Bible verses
- Learning to worship God with respect and joy
- Working with parents to raise children in God's ways`,
    bodyRw: `Korali Maranata ni korali y'abana ba Paruwasi ya Kicukiro. Yigisha abana guhimbaza Imana bishimye, gukunda Ijambo ryayo no gukoresha impano zabo kuva bakiri bato.

- Kuririmba mu materaniro no mu bikorwa by'abana
- Kwiga indirimbo n'imirongo ya Bibiliya
- Gutozwa kuramya Imana mu cyubahiro no mu byishimo
- Gufatanya n'ababyeyi kurera abana mu nzira y'Imana`
  },
  "men-fellowship": {
    image: "dept-men-fellowship.webp",
    body: `The men of Kicukiro Parish meet to pray, study God's Word and support one another.

They are encouraged to be good leaders in their homes, in the church and in the community, following the example of Christ.

- Prayer and teaching for men
- Supporting one another as brothers
- Building strong families
- Taking part in church and development activities`,
    bodyRw: `Abagabo bo muri Paruwasi ya Kicukiro bahurira hamwe kugira ngo basenge, bige Ijambo ry'Imana kandi bafashanye.

Bashishikarizwa kuba abayobozi beza mu ngo zabo, mu itorero no mu muryango nyarwanda, bakurikiza urugero rwa Kristo.

- Amasengesho n'inyigisho by'abagabo
- Gufashanya no kubaka ubuvandimwe
- Kubaka ingo zikomeye
- Kugira uruhare mu bikorwa by'itorero n'iterambere`
  },
  "women-fellowship": {
    image: "dept-women-fellowship.webp",
    body: `The women of Kicukiro Parish meet to pray, study God's Word and support one another.

They use their gifts to serve the church, care for families and help those in need.

- Prayer and teaching for women
- Caring for families and children
- Visiting and helping the sick and the vulnerable
- Taking part in the growth of the church`,
    bodyRw: `Abagore bo muri Paruwasi ya Kicukiro bahurira hamwe mu gusenga, kwiga Ijambo ry'Imana no gufashanya.

Bakoresha impano zabo mu gukorera itorero, kwita ku miryango no gufasha abakeneye ubufasha.

- Amasengesho n'inyigisho by'abagore
- Kwita ku miryango no ku bana
- Gusura no gufasha abarwayi n'abatishoboye
- Kugira uruhare mu iterambere ry'itorero`
  },
  "family-commission": {
    image: "dept-family-commission.webp",
    body: `The Family Commission helps homes and families grow strong in faith and love.

It walks with married couples, parents and those preparing for marriage through teaching, counselling and family activities.

- Teaching on marriage and family life
- Preparing couples for marriage
- Counselling for homes
- Family Week and other family activities`,
    bodyRw: `Komisiyo y'Umuryango ifasha ingo n'imiryango gukomera mu kwizera no mu rukundo.

Iba hafi y'abashakanye, ababyeyi n'abitegura gushinga urugo, ibinyujije mu nyigisho, inama n'ibikorwa by'umuryango.

- Inyigisho ku rugo n'umuryango
- Gutegura abitegura gushyingirwa
- Inama n'ubujyanama ku ngo
- Icyumweru cy'Umuryango n'ibindi bikorwa by'imiryango`
  },
  "evangelism-team": {
    image: "dept-evangelism-team.webp",
    body: `Cell groups bring together believers who live near each other to pray, study the Bible and care for one another.

They are a good way to get to know each other, support one another in daily life and share the Gospel with neighbours.

- Prayer and Bible study in small groups
- Visiting and supporting one another
- Welcoming and caring for new believers
- Sharing the Gospel with neighbours`,
    bodyRw: `Amatsinda ahuza abakristo baturanye kugira ngo basengere hamwe, bige Bibiliya kandi bitaneho.

Ni uburyo bwiza bwo kumenyana, gufashanya mu buzima bwa buri munsi no kugeza Ubutumwa Bwiza ku baturanyi.

- Amasengesho n'isomo rya Bibiliya mu matsinda
- Gusurana no gufashanya
- Kwakira no kwita ku bakristo bashya
- Kwamamaza Ubutumwa Bwiza mu baturanyi`
  },
  "ict-technical-team": {
    image: "dept-ict-technical-team.webp",
    body: `The ICT team makes sure sound, video and live streaming work well in every service.

It also helps the church reach more people through EMLR TV and social media.

- Sound during services
- Recording and live streaming services
- Managing the church website and social media
- Looking after technical equipment`,
    bodyRw: `Itsinda rya ICT rituma amajwi, amashusho n'ibiganiro bitambuka kuri interineti bigenda neza mu materaniro yose.

Rifasha kandi itorero kugeza ubutumwa ku bantu benshi binyuze kuri EMLR TV no ku mbuga nkoranyambaga.

- Gutunganya amajwi mu materaniro
- Gufata no gutambutsa amashusho kuri interineti
- Gucunga urubuga n'imbuga nkoranyambaga by'itorero
- Kwita ku bikoresho by'ikoranabuhanga`
  },
  "protocol-team": {
    image: "dept-protocol-team.webp",
    body: `The protocol team welcomes guests and members, shows people where to sit and helps every service run in good order.

They are often the first people a visitor meets at church.

- Welcoming guests and members
- Showing people to their seats
- Organising services and church gatherings
- Keeping the place of worship safe and clean`,
    bodyRw: `Itsinda rya Protocole ryakira abashyitsi n'abakristo, rikabereka aho bicara kandi rigafasha amateraniro kugenda neza.

Ni bo bantu ba mbere umushyitsi ahura na bo iyo ageze mu itorero.

- Kwakira abashyitsi n'abakristo
- Kwereka abantu aho bicara
- Gutegura neza amateraniro n'ibiterane
- Kubungabunga umutekano n'isuku by'aho dusengera`
  },
  "prayer-ministry": {
    image: "dept-prayer-ministry.webp",
    body: `The prayer team brings together believers who put prayer first.

It prays for the church, families, the sick, people facing difficulties and the nation, and it prays for the requests people send through this website.

- Weekly prayer meetings
- Praying for requests sent to the church
- Nights and days of prayer
- Praying for the sick and people in need`,
    bodyRw: `Itsinda ry'Amasengesho rihuza abakristo bashyira imbere gusenga.

Risengera itorero, imiryango, abarwayi, abafite ibibazo n'igihugu, kandi risengera ibyifuzo abantu bohereza banyuze kuri uru rubuga.

- Amateraniro y'amasengesho ya buri cyumweru
- Gusengera ibyifuzo byoherejwe mu itorero
- Amajoro n'iminsi byo gusenga
- Gusengera abarwayi n'abafite ibibazo`
  },
  "church-advisors": {
    image: "dept-church-advisors.webp",
    body: `Church advisors are experienced believers who help the parish leadership make good decisions.

They give counsel on church life, management and development, guided by God's Word.

- Advising the parish leadership
- Following up good management of the church
- Helping resolve issues peacefully
- Supporting church development projects`,
    bodyRw: `Abajyanama b'Itorero ni abakristo b'inararibonye bafasha ubuyobozi bwa Paruwasi gufata ibyemezo byiza.

Batanga inama ku mibereho y'itorero, ku micungire yaryo no ku iterambere ryaryo, bagendeye ku Ijambo ry'Imana.

- Kugira inama ubuyobozi bwa Paruwasi
- Gukurikirana imicungire myiza y'itorero
- Gufasha gukemura ibibazo mu bwumvikane
- Gushyigikira imishinga y'iterambere ry'itorero`
  },
  "youth-ministry": {
    image: "dept-youth-ministry.webp",
    body: `The youth of Kicukiro Parish meet to grow in faith, know God better and use their gifts in His work.

They are prepared to be strong believers and good leaders for the future.

- Youth services and teaching
- Talks about life, work and the future
- Outreach and acts of love
- Sports and fellowship activities`,
    bodyRw: `Urubyiruko rwa Paruwasi ya Kicukiro ruhurira hamwe kugira ngo rukure mu kwizera, rumenye Imana kurushaho kandi rukoreshe impano zarwo mu murimo wayo.

Rutegurirwa kuba abakristo bashikamye n'abayobozi beza b'ejo hazaza.

- Amateraniro n'inyigisho by'urubyiruko
- Ibiganiro ku buzima, ku murimo no ku hazaza
- Ivugabutumwa n'ibikorwa by'urukundo
- Imikino n'ibikorwa byo gusabana`
  },
  "children-ministry": {
    image: "dept-children-ministry.webp",
    body: `Sunday School teaches children God's Word in a way they understand.

Children learn Bible stories, songs and verses, and they learn to love God and other people.

- Bible lessons for each age group
- Songs and learning games
- Memorising Bible verses
- Children's activities in the church`,
    bodyRw: `Ishuri ryo ku Cyumweru ryigisha abana Ijambo ry'Imana mu buryo bubakwiriye.

Abana biga inkuru za Bibiliya, indirimbo n'imirongo, kandi bagatozwa gukunda Imana n'abantu.

- Amasomo ya Bibiliya akurikije imyaka y'abana
- Indirimbo n'imikino yigisha
- Gufata mu mutwe imirongo ya Bibiliya
- Ibikorwa by'abana mu itorero`
  }
};
