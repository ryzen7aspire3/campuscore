/* ============================================================
   CampusCore — CMS 18-Campus Data Engine
   Deterministic, branch-specific seed data for all 8 modules.
   Every branch is persisted under cms_branch_<branchId>.
   ============================================================ */

export const CAMPUSES = [
  {
    id: "chowk",
    name: "Chowk",
    code: "CMS-CHW",
    zone: "Old City",
    established: 1959,
    strength: 2610,
    attendance: 93.6,
    principal: "Dr. Meera Srivastava",
    accent: "from-amber-400 to-orange-500",
  },
  {
    id: "gomti-nagar-1",
    name: "Gomti Nagar Campus I",
    code: "CMS-GN1",
    zone: "Gomti Nagar",
    established: 1988,
    strength: 4280,
    attendance: 96.1,
    principal: "Dr. Rajeev Khanna",
    accent: "from-indigo-400 to-cyan-400",
  },
  {
    id: "gomti-nagar-ext-2",
    name: "Gomti Nagar Extension II",
    code: "CMS-GNX",
    zone: "Gomti Nagar Extension",
    established: 2006,
    strength: 3120,
    attendance: 95.2,
    principal: "Dr. Shalini Bose",
    accent: "from-sky-400 to-blue-500",
  },
  {
    id: "mahanagar",
    name: "Mahanagar",
    code: "CMS-MHN",
    zone: "Mahanagar",
    established: 1974,
    strength: 2980,
    attendance: 94.8,
    principal: "Mr. Alok Verma",
    accent: "from-violet-400 to-purple-500",
  },
  {
    id: "aliganj-1",
    name: "Aliganj Campus I",
    code: "CMS-AL1",
    zone: "Aliganj",
    established: 1982,
    strength: 2760,
    attendance: 94.1,
    principal: "Dr. Farah Ansari",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "aliganj-2",
    name: "Aliganj Campus II",
    code: "CMS-AL2",
    zone: "Aliganj",
    established: 1996,
    strength: 2140,
    attendance: 93.4,
    principal: "Mrs. Ritu Malhotra",
    accent: "from-rose-400 to-pink-500",
  },
  {
    id: "kanpur-road",
    name: "Kanpur Road",
    code: "CMS-KNR",
    zone: "Kanpur Road",
    established: 1991,
    strength: 3540,
    attendance: 95.6,
    principal: "Dr. Sanjay Tripathi",
    accent: "from-cyan-400 to-sky-500",
  },
  {
    id: "rdso",
    name: "RDSO",
    code: "CMS-RDS",
    zone: "RDSO Colony",
    established: 1979,
    strength: 1880,
    attendance: 93.9,
    principal: "Mrs. Nandini Iyer",
    accent: "from-lime-400 to-emerald-500",
  },
  {
    id: "rajajipuram-1",
    name: "Rajajipuram Campus I",
    code: "CMS-RJ1",
    zone: "Rajajipuram",
    established: 1986,
    strength: 2450,
    attendance: 93.2,
    principal: "Mr. Pankaj Rastogi",
    accent: "from-orange-400 to-red-500",
  },
  {
    id: "rajajipuram-2",
    name: "Rajajipuram Campus II",
    code: "CMS-RJ2",
    zone: "Rajajipuram",
    established: 2001,
    strength: 2260,
    attendance: 92.8,
    principal: "Dr. Anjali Sethi",
    accent: "from-fuchsia-400 to-pink-500",
  },
  {
    id: "station-road",
    name: "Station Road",
    code: "CMS-STR",
    zone: "Station Road",
    established: 1968,
    strength: 2320,
    attendance: 94.4,
    principal: "Mrs. Shabnam Qureshi",
    accent: "from-amber-300 to-yellow-500",
  },
  {
    id: "indira-nagar",
    name: "Indira Nagar",
    code: "CMS-IND",
    zone: "Indira Nagar",
    established: 1984,
    strength: 3060,
    attendance: 95.0,
    principal: "Dr. Vikram Chandra",
    accent: "from-teal-400 to-cyan-500",
  },
  {
    id: "golf-city",
    name: "Golf City",
    code: "CMS-GLF",
    zone: "Golf City",
    established: 2011,
    strength: 1740,
    attendance: 96.4,
    principal: "Ms. Tanya D'Souza",
    accent: "from-green-400 to-emerald-500",
  },
  {
    id: "anand-nagar",
    name: "Anand Nagar",
    code: "CMS-AND",
    zone: "Anand Nagar",
    established: 1993,
    strength: 2580,
    attendance: 94.6,
    principal: "Dr. Harish Pandey",
    accent: "from-blue-400 to-indigo-500",
  },
  {
    id: "asharfabad",
    name: "Asharfabad",
    code: "CMS-ASH",
    zone: "Asharfabad",
    established: 1972,
    strength: 1980,
    attendance: 93.1,
    principal: "Mrs. Rukhsana Ali",
    accent: "from-red-400 to-rose-500",
  },
  {
    id: "jopling-road",
    name: "Jopling Road",
    code: "CMS-JPL",
    zone: "Jopling Road",
    established: 1965,
    strength: 2210,
    attendance: 94.0,
    principal: "Mr. Desmond Fernandes",
    accent: "from-purple-400 to-violet-500",
  },
  {
    id: "rajendra-nagar-1",
    name: "Rajendra Nagar Campus I",
    code: "CMS-RN1",
    zone: "Rajendra Nagar",
    established: 1989,
    strength: 2870,
    attendance: 95.3,
    principal: "Dr. Neelam Srivastava",
    accent: "from-pink-400 to-fuchsia-500",
  },
  {
    id: "ayodhya-road",
    name: "Ayodhya Road",
    code: "CMS-AYD",
    zone: "Ayodhya Road",
    established: 2009,
    strength: 2640,
    attendance: 95.8,
    principal: "Dr. Amitabh Sen",
    accent: "from-indigo-400 to-blue-500",
  },
];

export const EVENT_CATEGORIES = ["STEM", "Arts", "Sports", "Literary", "Service", "Olympiad"];

export const CHRONICLE_CATEGORIES = ["Campus News", "Academics", "Sports", "Culture", "Circular"];

export const BOOK_SUBJECTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History & Civics",
  "Geography",
  "Commerce",
  "Economics",
  "Olympiad",
  "General Reading",
];

export const CARD_RULES = {
  red: {
    label: "Red Card",
    points: -20,
    tone: "rose",
    description: "Severe breach — automatically escalated to the Principal",
  },
  blue: {
    label: "Blue Card",
    points: -5,
    tone: "sky",
    description: "Advisory note — logged for the class mentor",
  },
  green: {
    label: "Green Card",
    points: 10,
    tone: "emerald",
    description: "Merit recognition — contributes to house points",
  },
};

export const BEHAVIOR_CATEGORIES = [
  "Discipline",
  "Academic Integrity",
  "Uniform & Grooming",
  "Punctuality",
  "Kindness",
  "Leadership",
  "Sportsmanship",
  "Community Service",
];

export const VOICE_CATEGORIES = [
  "Safety & Harassment",
  "Bullying",
  "Mental Health",
  "Academic Pressure",
  "Infrastructure",
  "Cafeteria & Hygiene",
  "Transport",
];

export const VOICE_STATUSES = ["Received", "Under Review", "Action Taken", "Resolved"];

export const FAME_CATEGORIES = ["ICSE Topper", "ISC Topper", "Olympiad", "Sports", "Arts"];

export const SUBJECT_SHELF_CODES = {
  "Computer Science": "CS",
  Mathematics: "MATH",
  Physics: "PHY",
  Chemistry: "CHEM",
  Biology: "BIO",
  English: "ENG",
  "History & Civics": "HIST",
  Geography: "GEO",
  Commerce: "COMM",
  Economics: "ECO",
  Olympiad: "OLY",
  "General Reading": "GEN",
};

/* ------------------------------------------------------------------
   Deterministic pseudo-random helpers
   ------------------------------------------------------------------ */

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const int = (rng, min, max) => Math.floor(rng() * (max - min + 1)) + min;

const pick = (rng, list) => list[Math.floor(rng() * list.length)];

function shuffle(rng, list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isoDay(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function isoStamp(daysAgo, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
}

/* ------------------------------------------------------------------
   Content blueprints
   ------------------------------------------------------------------ */

const EVENT_BLUEPRINTS = [
  {
    title: "RoboRally: Autonomous Bot Challenge",
    club: "Robotics & AI Club",
    category: "STEM",
    capacity: 60,
    venue: "Innovation Lab",
    time: "09:30 AM",
    faculty: "Dr. A. Sen",
    description:
      "Teams design and race an autonomous line-following rover through a graded obstacle arena. Arduino and Raspberry Pi kits are provided; sensor calibration begins one hour before the heats.",
  },
  {
    title: "Inter-House Coding Sprint (Java & Python)",
    club: "Coding Club",
    category: "STEM",
    capacity: 80,
    venue: "Computer Lab II",
    time: "11:00 AM",
    faculty: "Ms. R. Kapoor",
    description:
      "A three-hour algorithmic sprint with divisions for Java and Python. Problems are drawn from ICSE Computer Applications and introductory olympiad data structures.",
  },
  {
    title: "Junior Astronomers: Night Sky Watch",
    club: "Astronomy Club",
    category: "STEM",
    capacity: 45,
    venue: "Terrace Observatory",
    time: "06:45 PM",
    faculty: "Mr. V. Menon",
    description:
      "Guided observation of Jupiter, the Pleiades and lunar craters through campus telescopes, followed by a sky-mapping workshop and astrophotography clinic.",
  },
  {
    title: "Model United Nations: Global Futures Summit",
    club: "Debate & MUN Society",
    category: "Literary",
    capacity: 120,
    venue: "Main Auditorium",
    time: "09:00 AM",
    faculty: "Mrs. P. Bhatt",
    description:
      "Two days of committee simulations across UNGA, UNSC and WHO. Delegates receive position papers in advance and are judged on research depth, diplomacy and resolution drafting.",
  },
  {
    title: "CMS Parliamentary Debate: Motion & Counter-Motion",
    club: "Debate & MUN Society",
    category: "Literary",
    capacity: 64,
    venue: "Seminar Hall B",
    time: "02:00 PM",
    faculty: "Mrs. P. Bhatt",
    description:
      "Asian Parliamentary format with impromptu motions on technology, education and civic responsibility. Open to Classes IX to XII, with novice and senior brackets.",
  },
  {
    title: "Symphony Orchestra: Autumn Concert",
    club: "Music & Symphony Club",
    category: "Arts",
    capacity: 150,
    venue: "Main Auditorium",
    time: "05:30 PM",
    faculty: "Mr. D. D'Souza",
    description:
      "The campus orchestra performs a programme spanning Indian classical fusion, film score suites and a string arrangement of Vivaldi's Autumn. Rehearsal calls are posted weekly.",
  },
  {
    title: "Expressions: Inter-Campus Art Exhibition",
    club: "Visual Arts Society",
    category: "Arts",
    capacity: 100,
    venue: "Art Gallery Foyer",
    time: "10:00 AM",
    faculty: "Ms. N. Fatima",
    description:
      "An curated exhibition of graphite, watercolour and digital work by students across all 18 campuses. Live sketching stations and an artist talk run through the afternoon.",
  },
  {
    title: "Shakespeare in the Courtyard",
    club: "Theatre Guild",
    category: "Arts",
    capacity: 90,
    venue: "Open Amphitheatre",
    time: "04:30 PM",
    faculty: "Mr. R. Bose",
    description:
      "An open-air staging of selected scenes from A Midsummer Night's Dream, with student-led direction, costume design and a post-show audience conversation.",
  },
  {
    title: "Inter-Campus Basketball Championship",
    club: "Basketball Academy",
    category: "Sports",
    capacity: 72,
    venue: "Sports Complex",
    time: "08:00 AM",
    faculty: "Coach S. Rathore",
    description:
      "A knockout tournament across under-16 and under-19 divisions. Fixtures are published 48 hours in advance; medical clearance forms are mandatory for all participants.",
  },
  {
    title: "Athletics Meet: Track & Field Finals",
    club: "Athletics Club",
    category: "Sports",
    capacity: 110,
    venue: "Main Ground",
    time: "07:30 AM",
    faculty: "Coach M. Kaur",
    description:
      "Sprints, middle distance, relay and field events across four houses. Electronic timing will be used for finals and results feed directly into the house points table.",
  },
  {
    title: "Mathematical Olympiad Bootcamp",
    club: "Mathematics Olympiad Circle",
    category: "Olympiad",
    capacity: 55,
    venue: "Seminar Hall A",
    time: "01:30 PM",
    faculty: "Dr. S. Iyer",
    description:
      "Intensive problem-solving on number theory, combinatorics and inequalities. Includes a timed mock paper and individual solution clinics with olympiad mentors.",
  },
  {
    title: "Science Olympiad: Physics Relay",
    club: "Science & Innovation Forum",
    category: "Olympiad",
    capacity: 66,
    venue: "Physics Laboratory",
    time: "09:00 AM",
    faculty: "Mr. N. Raza",
    description:
      "Three-member teams rotate through experimental stations covering optics, circuits and mechanics. Accuracy, method and teamwork determine the final score.",
  },
  {
    title: "Eco Warriors: Miyawaki Plantation Drive",
    club: "Eco Warriors",
    category: "Service",
    capacity: 75,
    venue: "Campus Green Belt",
    time: "07:00 AM",
    faculty: "Ms. K. Joshi",
    description:
      "Plant and map a native-species micro-forest using the Miyawaki method. Students learn soil preparation, sapling spacing and a two-year maintenance roster.",
  },
  {
    title: "Community Literacy Outreach",
    club: "Social Service League",
    category: "Service",
    capacity: 50,
    venue: "Community Hall",
    time: "03:30 PM",
    faculty: "Mr. A. Hussain",
    description:
      "Weekly teaching circle for neighbourhood learners, led by senior students with faculty supervision. Volunteers complete a short pedagogy orientation first.",
  },
  {
    title: "Young Entrepreneurs: Pitch Day",
    club: "Entrepreneurship Cell",
    category: "STEM",
    capacity: 58,
    venue: "Innovation Lab",
    time: "11:30 AM",
    faculty: "Ms. T. Ahuja",
    description:
      "Student teams present a validated venture idea to a panel of alumni founders. Deliverables include a one-page business model and a three-minute pitch.",
  },
];

const NEWS_BLUEPRINTS = [
  {
    title: "Robotics Team Wins National Innovation Cup",
    category: "Campus News",
    author: "Office of Co-Curricular Affairs",
    excerpt:
      "A six-member student team from the campus robotics lab has won the National Innovation Cup for an assistive navigation device.",
    body:
      "A six-member team from the campus Robotics & AI Club has won the National Innovation Cup, held this year at the Indian Institute of Technology. The team's entry, an assistive navigation sleeve for visually impaired pedestrians, beat 214 school and junior-college projects from across the country.\n\nThe device combines an ultrasonic ranging array with haptic feedback and a lightweight on-board classifier that warns the wearer of obstacles at chest height — a blind spot for conventional white-cane users. Judges praised the team's field testing, which involved more than forty hours of supervised trials.\n\nThe team will now represent the school at the Asia-Pacific student innovation showcase. The Principal has announced a dedicated prototyping grant and an open lab slot every Wednesday afternoon for students who wish to build on the design.",
  },
  {
    title: "Inter-Campus Science Symposium Draws 1,200 Delegates",
    category: "Academics",
    author: "Science & Innovation Forum",
    excerpt:
      "Eighteen campuses converged for a two-day symposium featuring 96 student research posters and four keynote lectures.",
    body:
      "The annual CMS Inter-Campus Science Symposium welcomed 1,200 delegates from all eighteen campuses for two days of presentations, workshops and debate. Ninety-six student research posters were displayed, spanning computational biology, sustainable materials and observational astronomy.\n\nKeynote sessions included a lecture on quantum sensing and a workshop on reproducible data analysis for school laboratories. Students also participated in a rapid-fire research pitch, with the top six teams invited to develop their work into full papers.\n\nFaculty coordinators noted a marked increase in cross-campus collaboration, with several projects now sharing datasets and mentor support. Selected abstracts will be published in the school's annual research digest.",
  },
  {
    title: "Annual Sports Meet Concludes with Fourteen Meet Records",
    category: "Sports",
    author: "Department of Physical Education",
    excerpt:
      "Four days of competition produced fourteen new meet records and a narrow overall house championship.",
    body:
      "The Annual Sports Meet concluded after four days of competition across athletics, basketball, swimming and team sports. Fourteen meet records were broken, including a standout under-19 400m run that has qualified for the state inter-school finals.\n\nThe overall house championship was decided in the final relay, with a margin of just six points. Coaches highlighted the depth of participation this year, with more than 900 students taking part across divisions.\n\nThe Department of Physical Education will run a recovery and conditioning week before winter training begins. Parents are invited to the felicitation ceremony next Saturday at the main ground.",
  },
  {
    title: "Class XII Toppers Felicitated at Founder's Day",
    category: "Academics",
    author: "Office of the Principal",
    excerpt:
      "The campus celebrated its ISC and ICSE achievers, including three students above 99% aggregate.",
    body:
      "At the Founder's Day assembly, the campus felicitated its ICSE and ISC achievers in the presence of faculty, parents and members of the school management. Three students crossed the 99% aggregate mark, with particular strength shown in mathematics, computer science and economics.\n\nThe Principal thanked the graduating cohort for its discipline and curiosity, and announced a peer-mentoring programme in which recent toppers will guide Class X and XII students through revision planning.\n\nA commemorative citation and a book grant were presented to each achiever. The full honours list is displayed in the Wall of Fame section of CampusCore.",
  },
  {
    title: "Eco Warriors Plant 500 Native Saplings",
    category: "Campus News",
    author: "Eco Warriors Club",
    excerpt:
      "A student-led Miyawaki plantation drive has added a native micro-forest to the campus green belt.",
    body:
      "The Eco Warriors Club completed a Miyawaki-style plantation drive, adding 500 native saplings to the campus green belt. Species were selected for drought tolerance and pollinator value, including neem, jamun, amaltas and butterfly-friendly shrubs.\n\nThe club has published a two-year maintenance roster and installed drip irrigation lines. Biology students will monitor soil moisture and sapling survival as part of a long-term field study.\n\nThe initiative was supported by the campus maintenance team and a parent volunteer group. A second phase is planned for the north boundary before the monsoon.",
  },
  {
    title: "Theatre Guild Stages Tagore's 'The Post Office'",
    category: "Culture",
    author: "Theatre Guild",
    excerpt:
      "Three evening performances brought Rabindranath Tagore's meditation on hope and childhood to the open amphitheatre.",
    body:
      "The Theatre Guild staged three evening performances of Rabindranath Tagore's The Post Office at the open amphitheatre. The production used a minimalist set, live percussion and a student ensemble drawn from Classes VIII to XII.\n\nDirection, costume and lighting were entirely student-led, supported by two faculty mentors. Post-show conversations invited the audience to reflect on the play's themes of confinement, imagination and quiet hope.\n\nThe Guild will hold open auditions for its winter production next month. Students interested in stagecraft, sound or front-of-house are encouraged to attend.",
  },
  {
    title: "Library Reading Week Inspires 3,000 Borrowings",
    category: "Campus News",
    author: "Digital Library Committee",
    excerpt:
      "Reading Week featured author interactions, a book-swap fair and a record number of student borrowings.",
    body:
      "Reading Week concluded with more than 3,000 borrowings across the campus library network, the highest weekly figure this academic year. The programme included author interactions, a student-curated book-swap fair and daily 'first page' readings at assembly.\n\nThe library team also introduced reading circles for Classes VI to VIII and a research-skills clinic for senior students. Subject teachers integrated independent reading into their lesson plans for the week.\n\nA shortlist of the most-borrowed titles is available at the library desk. The next Reading Week will coincide with the inter-campus literary festival.",
  },
  {
    title: "Model UN Delegation Returns with Best Delegation Honour",
    category: "Culture",
    author: "Debate & MUN Society",
    excerpt:
      "A 24-member delegation earned the Best Large Delegation award at a city-wide Model United Nations conference.",
    body:
      "A 24-member delegation represented the campus at a city-wide Model United Nations conference, returning with the Best Large Delegation award. Students debated resolutions on climate finance, refugee protection and the governance of emerging technologies.\n\nFour students received individual committee honours, and two draft resolutions authored by the delegation were adopted by the conference. Faculty mentors credited the team's preparation and its disciplined approach to negotiation.\n\nThe society will host an intra-campus simulation next term, with open registration for first-time delegates.",
  },
];

const CIRCULAR_BLUEPRINTS = [
  {
    title: "CISCE Circular: Registration Window for ICSE & ISC 2027",
    category: "Circular",
    seal: "CISCE",
    author: "Controller of Examinations",
    excerpt:
      "Schools must complete candidate registration and subject verification within the stipulated window. Late entries require written approval.",
    body:
      "The Council for the Indian School Certificate Examinations has opened the candidate registration window for the ICSE and ISC 2027 examinations. All affiliated schools must complete candidate data entry, subject verification and fee submission within the notified window.\n\nPrincipals are advised to verify the spelling of candidate names against school records, confirm the subject combination for each candidate, and retain signed declarations on file. Requests for late registration must be accompanied by a written justification from the Head of School.\n\nA detailed technical handbook for the online portal has been circulated to examination coordinators. Queries may be directed to the Council's helpdesk during working hours.",
  },
  {
    title: "Principal's Circular: Half-Yearly Examination Schedule",
    category: "Circular",
    seal: "PRINCIPAL",
    author: "Office of the Principal",
    excerpt:
      "The half-yearly examination schedule, seating plan and invigilation roster are now published for Classes VI to XII.",
    body:
      "The half-yearly examinations for Classes VI to XII will commence as per the schedule displayed on the campus noticeboard and the School Chronicle portal. Morning sessions begin at 8:30 AM; students should report to their allotted rooms by 8:10 AM.\n\nSeating plans are organised by roll number and will be displayed outside each examination hall. Invigilation rosters have been shared with department heads. Teachers are requested to collect question papers from the examination office thirty minutes before each session.\n\nStudents must carry their identity cards and use only the stationery permitted for each paper. Any medical absence must be supported by a certificate submitted within 48 hours.",
  },
  {
    title: "CISCE Circular: Practical Examination Guidelines",
    category: "Circular",
    seal: "CISCE",
    author: "Controller of Examinations",
    excerpt:
      "Subject-specific practical examination protocols, laboratory readiness and assessor requirements for the current session.",
    body:
      "The Council has issued guidelines for the conduct of practical examinations in science, computer science and vocational subjects. Schools must confirm laboratory readiness, equipment calibration and the availability of qualified internal assessors.\n\nRecords of experiments, project files and candidate attendance must be maintained in the prescribed format and made available for verification. External assessors will be appointed by the Council for designated subjects.\n\nSchools should submit the practical examination readiness checklist at least two weeks before the first scheduled session.",
  },
  {
    title: "Principal's Circular: Campus Safety & Visitor Protocol",
    category: "Circular",
    seal: "PRINCIPAL",
    author: "Office of the Principal",
    excerpt:
      "Revised visitor verification, gate management and emergency drill procedures take effect immediately.",
    body:
      "In the interest of campus safety, the following protocol takes effect immediately. All visitors must present a government-issued photo identity at the main gate and record their entry in the digital visitor register. Deliveries will be received at the designated gate only.\n\nStudents will be released early only against a written parental request verified by the class teacher and the front office. Unfamiliar adults approaching students at dispersal should be reported to the gate marshal without delay.\n\nA campus-wide emergency drill will be conducted this month. Department heads should familiarise staff with evacuation routes and assembly points.",
  },
];

const VOICE_BLUEPRINTS = [
  {
    category: "Bullying",
    urgency: "High",
    message:
      "A group of senior students has been cornering a Class VII student near the back staircase during the lunch break. It has happened three times this week and the student is visibly anxious.",
    status: "Under Review",
    reply:
      "Thank you for speaking up. A counselor has reviewed this report and the corridor supervision roster has been revised. We are speaking with the students involved and will keep monitoring the area. Your identity remains completely private.",
  },
  {
    category: "Mental Health",
    urgency: "Medium",
    message:
      "I feel constantly overwhelmed before tests and cannot sleep. I do not want to talk to my teachers because I am afraid of being judged. Is there a way to speak to someone privately?",
    status: "Action Taken",
    reply:
      "You are not alone in feeling this way. A confidential counseling slot has been reserved for you — please ask at the wellness room between 10 AM and 12 PM and mention this token. We will not share your details with anyone without your consent.",
  },
  {
    category: "Infrastructure",
    urgency: "Medium",
    message:
      "The water cooler on the second floor has been leaking for over a week and the floor near the science lab becomes slippery. Someone could fall.",
    status: "Received",
    reply: "",
  },
  {
    category: "Cafeteria & Hygiene",
    urgency: "Low",
    message:
      "The serving counter is often left uncovered during the second break and there are no hand-sanitizer refills near the queue. Could hygiene checks be more frequent?",
    status: "Resolved",
    reply:
      "The cafeteria supervisor has been instructed to keep counters covered and to refill sanitizer stations before each break. A weekly hygiene inspection has been added to the maintenance calendar. Thank you for the suggestion.",
  },
  {
    category: "Academic Pressure",
    urgency: "High",
    message:
      "Several of us are taking five tuitions and still cannot finish the daily assignments. The workload after school leaves almost no time to rest, and some students are copying work just to keep up.",
    status: "Under Review",
    reply:
      "Thank you for describing this so clearly. The academic coordinators are reviewing assignment load across departments and will discuss a staggered submission calendar. If you would like a private conversation, please use your token at the wellness room.",
  },
  {
    category: "Transport",
    urgency: "Medium",
    message:
      "The afternoon bus to the east route has been arriving late by 25 to 30 minutes for the past two weeks, and students wait in the open without shade.",
    status: "Action Taken",
    reply:
      "The transport office has added a standby bus for the east route and arranged shade seating near Gate 3. Route timings will be reviewed again at the end of the month.",
  },
  {
    category: "Safety & Harassment",
    urgency: "Critical",
    message:
      "An adult outside the campus boundary has been repeatedly trying to speak with students near the side gate after school. It is making several younger students uncomfortable.",
    status: "Action Taken",
    reply:
      "This has been treated as a priority. The gate marshal and local security have been briefed, the side gate will remain supervised until 5 PM, and the matter has been escalated to the Principal. Please avoid that gate until further notice.",
  },
  {
    category: "Mental Health",
    urgency: "Low",
    message:
      "Could the school organise a short session on managing screen time and sleep before the board exams? A lot of us stay up scrolling and then cannot focus in the morning.",
    status: "Resolved",
    reply:
      "A 45-minute wellness workshop on sleep, screens and exam focus has been scheduled for next month. It will be announced through class teachers and the School Chronicle. Thank you for the idea.",
  },
];

const RED_REASONS = [
  "Repeated disruption in class after two written warnings",
  "Physical altercation near the sports block",
  "Academic dishonesty during a unit assessment",
  "Bullying behaviour reported by multiple peers",
  "Deliberate damage to laboratory equipment",
  "Leaving campus without authorization during school hours",
];

const BLUE_REASONS = [
  "Late arrival to first period on three occasions",
  "Incomplete homework for consecutive days",
  "Uniform and grooming advisory",
  "Phone use during instructional time",
  "Unprepared for a scheduled laboratory session",
  "Talking during a quiet study period",
];

const GREEN_REASONS = [
  "Volunteered to mentor a junior student through a difficult topic",
  "Led a class service project with exceptional organization",
  "Outstanding sportsmanship at the inter-house meet",
  "Measurable improvement in mathematics after focused effort",
  "Represented the campus at the state science fair",
  "Supported a new student through their first week",
  "Completed a self-directed reading and research project",
];

const STUDENT_NAMES = [
  "Aarav Verma",
  "Ananya Singh",
  "Kabir Mehra",
  "Riya Sharma",
  "Ishaan Tiwari",
  "Devansh Gupta",
  "Rohan Malhotra",
  "Vikramaditya Rao",
  "Sara Khan",
  "Aditi Mishra",
  "Arjun Nair",
  "Diya Agarwal",
  "Aryan Saxena",
  "Myra Joshi",
  "Shaurya Pandey",
  "Navya Tripathi",
  "Vivaan Kapoor",
  "Aisha Siddiqui",
  "Krish Yadav",
  "Prisha Bansal",
  "Rehan Ali",
  "Tanvi Deshmukh",
];

const CLASS_SECTIONS = ["VI-A", "VI-B", "VII-A", "VII-B", "VIII-A", "VIII-B", "IX-A", "IX-B", "IX-C", "X-A", "X-B", "XI-A", "XI-B", "XII-A", "XII-B"];

const BOOK_BLUEPRINTS = [
  { title: "ICSE Computer Applications — Class X", author: "APC Editorial Board", subject: "Computer Science", copies: 6 },
  { title: "Concise Mathematics for ICSE — Class IX", author: "R. S. Aggarwal", subject: "Mathematics", copies: 5 },
  { title: "Selina Physics for ICSE — Class X", author: "Selina Editorial Team", subject: "Physics", copies: 4 },
  { title: "Selina Chemistry for ICSE — Class X", author: "Selina Editorial Team", subject: "Chemistry", copies: 4 },
  { title: "Certificate Biology for ICSE — Class IX", author: "S. K. Aggarwal", subject: "Biology", copies: 3 },
  { title: "The Merchant of Venice — Shakespeare", author: "William Shakespeare", subject: "English", copies: 7 },
  { title: "Total History & Civics for ICSE", author: "D. N. Kundra", subject: "History & Civics", copies: 5 },
  { title: "ICSE Geography: A Complete Course", author: "Goyal Brothers", subject: "Geography", copies: 4 },
  { title: "Commercial Studies for ICSE", author: "C. B. Gupta", subject: "Commerce", copies: 3 },
  { title: "ICSE Economics — Principles & Applications", author: "A. Banerjee", subject: "Economics", copies: 4 },
  { title: "The Art of Problem Solving, Volume 1", author: "R. Rusczyk", subject: "Olympiad", copies: 2 },
  { title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest & Stein", subject: "Computer Science", copies: 2 },
  { title: "Python Crash Course", author: "Eric Matthes", subject: "Computer Science", copies: 3 },
  { title: "Wings of Fire", author: "A. P. J. Abdul Kalam", subject: "General Reading", copies: 6 },
  { title: "The Diary of a Young Girl", author: "Anne Frank", subject: "General Reading", copies: 5 },
  { title: "A Brief History of Time", author: "Stephen Hawking", subject: "General Reading", copies: 3 },
];

const FAME_BLUEPRINTS = [
  { category: "ICSE Topper", achievement: "ICSE 2026 — 99.4% aggregate, city rank 2", score: "99.4%", medal: "gold", className: "X-A" },
  { category: "ISC Topper", achievement: "ISC 2026 — 99.2% aggregate, science stream", score: "99.2%", medal: "gold", className: "XII-A" },
  { category: "ICSE Topper", achievement: "ICSE 2026 — 98.8% with perfect scores in Computer Applications", score: "98.8%", medal: "silver", className: "X-B" },
  { category: "Olympiad", achievement: "International Mathematics Olympiad — Gold Medal, national top 20", score: "Gold", medal: "gold", className: "XI-A" },
  { category: "Olympiad", achievement: "Indian Olympiad in Informatics — Bronze Medal", score: "Bronze", medal: "bronze", className: "XII-B" },
  { category: "Olympiad", achievement: "National Science Olympiad — Silver Medal, physics stream", score: "Silver", medal: "silver", className: "IX-A" },
  { category: "Sports", achievement: "National Inter-School Swimming — Gold, 100m freestyle", score: "Gold", medal: "gold", className: "XI-B" },
  { category: "Sports", achievement: "State Basketball Championship — Most Valuable Player", score: "MVP", medal: "silver", className: "XII-A" },
  { category: "Arts", achievement: "All-India Classical Vocal Competition — First place", score: "1st", medal: "gold", className: "X-A" },
  { category: "Arts", achievement: "National Young Artist Exhibition — Best in Show", score: "Best", medal: "silver", className: "IX-B" },
];

const DIRECTIVE_BLUEPRINTS = [
  {
    title: "Executive Directive: Campus Safety Week",
    message:
      "Campus Safety Week begins Monday. Gate marshals will verify identity cards at every entry point, and all lab and activity rooms must be secured by 4:00 PM. Department heads should confirm compliance to the Principal's office.",
    severity: "urgent",
  },
  {
    title: "Executive Directive: Examination Readiness",
    message:
      "Half-yearly examination seating plans and invigilation rosters are now live. Teachers should submit question papers to the examination office 48 hours before each session and brief students on stationery rules.",
    severity: "info",
  },
  {
    title: "Executive Directive: Founder's Day Rehearsals",
    message:
      "Founder's Day rehearsals begin Wednesday in the main auditorium. Departments should submit participation lists and audio requirements by Tuesday evening. Normal classes will run as scheduled.",
    severity: "celebratory",
  },
];

/* ------------------------------------------------------------------
   Build a complete, branch-specific store
   ------------------------------------------------------------------ */

export function getCampus(branchId) {
  return CAMPUSES.find((campus) => campus.id === branchId) || CAMPUSES[0];
}

export function buildBranchData(branchId) {
  const campus = getCampus(branchId);
  const rng = mulberry32(hashString(branchId));
  const hash = hashString(branchId);

  const eventBlueprints = shuffle(rng, EVENT_BLUEPRINTS).slice(0, 7);
  const events = eventBlueprints.map((blueprint, index) => {
    const capacity = blueprint.capacity;
    const baseRegistered = Math.round(capacity * (0.42 + rng() * 0.46));
    const full = index === 2 && hash % 3 === 0;
    return {
      id: `EVT-${campus.code.slice(4)}-${String(index + 1).padStart(2, "0")}`,
      title: blueprint.title,
      club: blueprint.club,
      category: blueprint.category,
      description: blueprint.description,
      date: isoDay(4 + index * 5 + int(rng, 0, 2)),
      time: blueprint.time,
      venue: blueprint.venue,
      faculty: blueprint.faculty,
      capacity,
      registered: full ? capacity : Math.min(capacity, baseRegistered),
      createdAt: isoStamp(int(rng, 5, 20), 9),
    };
  });

  const news = shuffle(rng, NEWS_BLUEPRINTS)
    .slice(0, 4)
    .map((blueprint, index) => ({
      id: `CHR-${campus.code.slice(4)}-N${index + 1}`,
      title: blueprint.title,
      category: blueprint.category,
      author: blueprint.author,
      excerpt: blueprint.excerpt,
      body: blueprint.body,
      official: false,
      seal: null,
      likes: int(rng, 24, 186),
      liked: false,
      bookmarked: false,
      date: isoDay(-1 * (index * 3 + int(rng, 1, 3))),
    }));

  const circulars = shuffle(rng, CIRCULAR_BLUEPRINTS)
    .slice(0, 2)
    .map((blueprint, index) => ({
      id: `CHR-${campus.code.slice(4)}-C${index + 1}`,
      title: blueprint.title,
      category: "Circular",
      author: blueprint.author,
      excerpt: blueprint.excerpt,
      body: blueprint.body,
      official: true,
      seal: blueprint.seal,
      likes: int(rng, 12, 74),
      liked: false,
      bookmarked: false,
      date: isoDay(-1 * (index * 2 + 1)),
    }));

  const articles = [...news, ...circulars].sort((a, b) => b.date.localeCompare(a.date));

  const voiceBlueprints = shuffle(rng, VOICE_BLUEPRINTS).slice(0, 5);
  const usedTokens = new Set();
  const voiceTickets = voiceBlueprints.map((blueprint, index) => {
    let token = "";
    do {
      token = `SV-${1000 + ((hash + index * 137) % 8800)}`;
    } while (usedTokens.has(token));
    usedTokens.add(token);
    const createdAt = isoStamp(int(rng, 1, 14), int(rng, 8, 17));
    return {
      id: `TKT-${campus.code.slice(4)}-${index + 1}`,
      token,
      category: blueprint.category,
      urgency: blueprint.urgency,
      message: blueprint.message,
      status: blueprint.status,
      createdAt,
      updatedAt: createdAt,
      replies: blueprint.reply
        ? [
            {
              id: `REP-${index + 1}`,
              author: "CMS Confidential Counselor",
              text: blueprint.reply,
              at: new Date(new Date(createdAt).getTime() + 1000 * 60 * 60 * 26).toISOString(),
            },
          ]
        : [],
    };
  });

  const names = shuffle(rng, STUDENT_NAMES);
  const behaviorCards = [];
  const cardPlan = ["red", "red", "blue", "blue", "green", "green", "green", "blue", "red"];
  cardPlan.forEach((type, index) => {
    const reasons = type === "red" ? RED_REASONS : type === "blue" ? BLUE_REASONS : GREEN_REASONS;
    behaviorCards.push({
      id: `BC-${campus.code.slice(4)}-${String(index + 1).padStart(2, "0")}`,
      student: names[index % names.length],
      className: CLASS_SECTIONS[(index * 3 + 2) % CLASS_SECTIONS.length],
      roll: `${CLASS_SECTIONS[(index * 3 + 2) % CLASS_SECTIONS.length].replace("-", "")}-${String(10 + index * 3).padStart(2, "0")}`,
      type,
      points: CARD_RULES[type].points,
      category: pick(rng, BEHAVIOR_CATEGORIES),
      note: reasons[index % reasons.length],
      issuedBy: pick(rng, ["Mrs. S. Kapoor", "Mr. R. Mishra", "Ms. P. Das", "Dr. A. Sen", "Coach M. Kaur"]),
      date: isoStamp(int(rng, 0, 18), int(rng, 9, 15)),
      resolved: false,
    });
  });

  const bookBlueprints = shuffle(rng, BOOK_BLUEPRINTS).slice(0, 12);
  const books = bookBlueprints.map((blueprint, index) => {
    const shelfPrefix = SUBJECT_SHELF_CODES[blueprint.subject] || "GEN";
    const copies = blueprint.copies;
    return {
      id: `BK-${campus.code.slice(4)}-${String(index + 1).padStart(2, "0")}`,
      title: blueprint.title,
      author: blueprint.author,
      subject: blueprint.subject,
      shelf: `SHELF-${shelfPrefix}-${String(int(rng, 1, 24)).padStart(2, "0")}`,
      copies,
      available: Math.max(0, copies - int(rng, 0, copies)),
      campusId: campus.id,
      campusName: campus.name,
      addedAt: isoStamp(int(rng, 30, 400), 11),
    };
  });

  const fameBlueprints = shuffle(rng, FAME_BLUEPRINTS).slice(0, 6);
  const achievers = fameBlueprints.map((blueprint, index) => ({
    id: `FAME-${campus.code.slice(4)}-${index + 1}`,
    name: names[(index + 4) % names.length],
    className: blueprint.className,
    category: blueprint.category,
    achievement: blueprint.achievement,
    score: blueprint.score,
    medal: blueprint.medal,
    applause: int(rng, 38, 320),
    applauded: false,
    inductedAt: isoStamp(int(rng, 3, 90), 12),
  }));

  const directiveBlueprint = DIRECTIVE_BLUEPRINTS[hash % DIRECTIVE_BLUEPRINTS.length];
  const hasDirective = hash % 4 !== 0 || campus.id === "gomti-nagar-1";

  return {
    version: 1,
    campusId: campus.id,
    updatedAt: new Date().toISOString(),
    events,
    passes: [],
    articles,
    voiceTickets,
    behaviorCards,
    books,
    reservations: [],
    achievers,
    directive: hasDirective
      ? {
          id: `DIR-${campus.code.slice(4)}-${hash % 1000}`,
          title: directiveBlueprint.title,
          message: directiveBlueprint.message,
          severity: directiveBlueprint.severity,
          issuedBy: campus.principal,
          issuedAt: isoStamp(0, 8),
        }
      : null,
    vault: [],
  };
}

/* ------------------------------------------------------------------
   Derived analytics
   ------------------------------------------------------------------ */

export function computeHealth(store) {
  const campus = getCampus(store?.campusId);
  const events = store?.events || [];
  const cards = store?.behaviorCards || [];
  const tickets = store?.voiceTickets || [];
  const books = store?.books || [];

  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const totalRegistered = events.reduce((sum, event) => sum + event.registered, 0);
  const clubParticipation = totalCapacity ? Math.round((totalRegistered / totalCapacity) * 100) : 0;

  const reds = cards.filter((card) => card.type === "red" && !card.resolved).length;
  const blues = cards.filter((card) => card.type === "blue").length;
  const greens = cards.filter((card) => card.type === "green").length;
  const openTickets = tickets.filter((ticket) => ticket.status !== "Resolved").length;

  const totalCopies = books.reduce((sum, book) => sum + book.copies, 0);
  const checkedOut = books.reduce((sum, book) => sum + (book.copies - book.available), 0);
  const libraryUsage = totalCopies ? Math.round((checkedOut / totalCopies) * 100) : 0;

  const disciplineIndex = Math.min(100, Math.max(35, 100 - reds * 7 - blues * 2 + Math.min(greens * 2, 12)));
  const wellbeing = Math.min(100, Math.max(40, 100 - openTickets * 8));
  const attendance = campus?.attendance || 94;

  const score = Math.round(
    attendance * 0.34 +
      clubParticipation * 0.18 +
      disciplineIndex * 0.24 +
      wellbeing * 0.16 +
      Math.min(libraryUsage + 40, 100) * 0.08
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    attendance,
    clubParticipation,
    disciplineIndex,
    wellbeing,
    libraryUsage,
    reds,
    blues,
    greens,
    openTickets,
    totalEvents: events.length,
    totalBooks: books.length,
    totalAchievers: (store?.achievers || []).length,
  };
}
