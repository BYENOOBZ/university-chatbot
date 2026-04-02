const { Pinecone } = require("@pinecone-database/pinecone")
const { CohereClient } = require("cohere-ai")
require("dotenv").config({ path: "../backend/.env" })

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY })

const universityData = [
    // CONTACT AND GENERAL
    "IILM University has two campuses: Gurugram at Plot No. 69-71, Golf Course Road, Sector 53, Gurugram, Haryana 122003 and Greater Noida at Plot No. 16-18, Knowledge Park II, Greater Noida, UP 201306. Website: www.iilm.edu. Email: admissions@iilm.edu.",
    "IILM University contact numbers: MBA: +91-8065905223, UG: +91-8065905224, Engineering Gurugram: +91-8065905221, Engineering Greater Noida: +91-8065905220, BBA: +91-8065905222, PG Non-MBA: +91-8065905225.",
  
    // ADMISSION PROCESS
    "IILM University admission process: Applications through online portal at www.iilm.edu or walk-in at campus. Selection is based on academic record from Class 10 and 12, Personal Interview, and program-specific aptitude test or case study. For BDes there is a Design Aptitude Test. Eligibility is minimum 50% aggregate in 10+2 for Greater Noida campus and minimum 55% for Gurugram campus.",
    "IILM University documents required for admission: Class 10 and 12 mark sheets and certificates, entrance exam scorecard if applicable, passport size photographs, Aadhaar card or ID proof, category certificate if applicable, and migration certificate for students from other boards.",
    "IILM University academic session starts in July or August every year. Applications open from January onwards. Early application is encouraged as scholarships are available on first come first served basis. Scholarship application deadline is August 31 2026.",
  
    // UNDERGRADUATE PROGRAMMES
    "IILM University undergraduate BBA programme offers specialisations in Finance, Marketing, HRM, AI, Business Analytics, Entrepreneurship, International Business, Logistics, Aviation, Banking and Finance, Hospitality, and Real Estate. Duration is 4 years with 160 credits.",
    "IILM University undergraduate BTech CSE programme offers specialisations in AI and ML, Data Science and Big Data Analytics, Cloud Computing, Cyber Security, Graphics and Gaming, and Full Stack Web Development. Duration is 4 years.",
    "IILM University undergraduate BTech Engineering programmes include Biotechnology, Bioinformatics, Food Technology, Electronics and Communication Engineering, Robotics and AI, Semiconductor Technology, Mechanical Engineering, and Civil and Sustainable Infrastructure.",
    "IILM University undergraduate BCA programme duration is 3 years. BA LLB Hons and BBA LLB Hons are 5 year integrated law programmes. BDes programmes available in Fashion Design and Management, Digital Product Design, and Interior Design.",
    "IILM University undergraduate programmes also include BA Hons Psychology, BSc Hons Clinical Psychology, BA Hons Journalism and Mass Communication, BA Hons Corporate Communication, BSc Animation and UI UX, and BA Hons Liberal Arts with Political Science, Economics, International Relations, and English Literature.",
    "IILM University BTech and all UG programmes follow NEP 2020 with multiple exit options: Certificate after 1 year, Diploma after 2 years, Bachelor degree after 3 years, Honours degree after 4 years. Flexible Major Minor pathways and Dual Major options available.",
  
    // POSTGRADUATE PROGRAMMES
    "IILM University postgraduate MBA programme is 2 years with 80 plus credits. MBA specialisations include Data Science, HR, Marketing, Finance, Sports, Healthcare, and Entrepreneurship. STEM MBA options also available. Includes Summer Internship Programme from April to June.",
    "IILM University postgraduate programmes include MTech in Generative AI and Robotics, MCA, LLM, MA and MSc Psychology, MA Mass Communication, and PhD programmes across disciplines.",
    "IILM University MTech Generative AI programme covers Large Language Models, Diffusion Models, GANs, Transformer Architecture, Prompt Engineering, AI Ethics, and Research Methodology.",
  
    // FEES - GREATER NOIDA
    "IILM University Greater Noida campus BTech CSE fee is Rs 2,25,000 per year totalling Rs 9,00,000 for 4 years. Per semester fee is Rs 1,12,500. BTech CSE with IBM collaboration is Rs 2,75,000 per year. BTech CSE with Apple is Rs 2,75,000 per year. BTech CSE with Microsoft is Rs 2,55,000 in year 1 then Rs 2,25,000 per year.",
    "IILM University Greater Noida campus BTech CSE Full Stack with L&T is Rs 2,55,000 per year totalling Rs 10,20,000. BCA fee is Rs 2,00,000 per year totalling Rs 8,00,000. Per semester BCA fee is Rs 1,00,000.",
    "IILM University Greater Noida campus other BTech Engineering programmes including Biotechnology, Bioinformatics, Electrical, Electronics, Semiconductor, Food Technology, Mechanical, and Robotics AI are all Rs 2,00,000 per year totalling Rs 8,00,000 for 4 years.",
    "IILM University Greater Noida campus BBA Hons fee is Rs 2,50,000 per year totalling Rs 10,00,000. BBA with KPMG collaboration is Rs 2,75,000 per year. BA LLB and BBA LLB fee is Rs 2,40,000 per year for 5 years totalling Rs 12,00,000. LLB Hons is Rs 1,50,000 per year for 3 years.",
    "IILM University Greater Noida campus MBA fee is Rs 12,40,000 total for 2 years, per semester Rs 3,10,000. MTech programmes fee is Rs 1,20,000 per year totalling Rs 2,40,000. MCA fee is Rs 1,50,000 per year totalling Rs 3,00,000. LLM fee is Rs 2,00,000 for 1 year.",
  
    // FEES - GURUGRAM
    "IILM University Gurugram campus BTech CSE fee is Rs 3,00,000 per year totalling Rs 12,00,000 for 4 years. Per semester fee is Rs 1,50,000. BTech AI is Rs 3,50,000 per year totalling Rs 14,00,000. BTech CSE with Xebia and Microsoft is Rs 3,30,000 per year totalling Rs 13,20,000.",
    "IILM University Gurugram campus BBA Hons fee is Rs 4,50,000 per year totalling Rs 18,00,000. BA LLB and BBA LLB fee is Rs 3,50,000 per year for 5 years totalling Rs 17,50,000. BDes and BA Hons programmes are Rs 4,00,000 per year totalling Rs 16,00,000.",
    "IILM University Gurugram campus MBA fee is Rs 12,90,000 total for 2 years. MTech Generative AI fee is Rs 2,50,000 per year totalling Rs 5,00,000. LLM fee is Rs 2,50,000 for 1 year.",
  
    // SCHOLARSHIPS - COMPREHENSIVE
    "IILM University Gurugram BTech CSE scholarships: Based on JEE Main - 96-100 percentile gets 100%, 86-95 gets 40%, 76-85 gets 30%, 71-75 gets 25%, 66-70 gets 20%, 60-65 gets 10%. Based on Class 12 boards - 98% and above gets 100%, 90-97.99% gets 50%, 85-89.99% gets 30%, 76-84.99% gets 20%, 65-75.99% gets 10%. Based on CUET - 95+ gets 40%, 90-94.99 gets 30%, 80-89.99 gets 20%, 75-79.99 gets 10%. Sports - International 100%, National medal 50%, National 25%.",
    "IILM University Gurugram MBA scholarships: Based on CAT or XAT percentile - 95 and above gets 100%, 90-94 gets 80%, 85-89 gets 60%, 80-84 gets 40%, 70-79 gets 20%, 60-69 gets 10%. Based on CUET PG - above 80 percentile gets 20%, 70-80 gets 10%. Sports - International 100%, National medal 50%, National 25%. JEE Main is NOT applicable for MBA.",
    "IILM University Gurugram BBA scholarships: Based on Class 12 boards - 98% and above gets 100%, 90-97.99% gets 50%, 85-89.99% gets 30%, 76-84.99% gets 20%, 65-75.99% gets 10%. Based on CUET - 95+ gets 40%, 90-94.99 gets 30%, 80-89.99 gets 20%, 75-79.99 gets 10%. Sports - International 100%, National medal 50%, National 25%. JEE Main and CAT XAT are NOT applicable for BBA.",
    "IILM University Gurugram Law programmes BA LLB and BBA LLB scholarships: Based on CLAT or LSAT - 99 percentile and above gets 100%, 95-98.99 gets 50%, 80-94.99 gets 20%. Based on Class 12 boards - 98% and above gets 100%, 90-97.99% gets 50%, 85-89.99% gets 30%. Sports - International 100%, National medal 50%, National 25%.",
    "IILM University Gurugram BCA scholarships: Based on Class 12 boards - 98% and above gets 100%, 90-97.99% gets 50%, 85-89.99% gets 30%, 76-84.99% gets 20%, 65-75.99% gets 10%. Based on CUET - 95+ gets 40%, 90-94.99 gets 30%, 80-89.99 gets 20%, 75-79.99 gets 10%. Sports - International 100%, National medal 50%, National 25%.",
    "IILM University Sports scholarship: International level participants get 100%, National level Gold Silver Bronze medalists get 50%, other national participants get 25%. Must be 23 years or younger with minimum 3 years participation.",
    "IILM University special scholarships: Martyr wards get 100% tuition fee waiver from Army, Navy, Air Force, CRPF, BSF, ITBP, CISF, SSB, State Police, Coast Guard. Girls with family income below Rs 8 lakhs get 10% waiver. Students from J&K and North East get 10%. Children of defence personnel get 10%. Nepal applicants get 30%. Siblings of enrolled students get 10%.",
    "IILM University Haryana Domicile scholarship: Class 12 with 90% and family income below Rs 3 lakhs gets 100%. Class 12 with 80% and income below Rs 6 lakhs gets 50%. Class 12 with 75% and income below Rs 8 lakhs gets 25%. 25% seats reserved for Haryana students.",
    "IILM University scholarship rules: Only ONE scholarship allowed at a time, the higher benefit is given. Scholarships apply only on tuition fee not hostel or boarding. Deadline August 31 2026. Limited seats on first come first served basis. Full fees paid first, excess adjusted in Semester 2.",
    "IILM University scholarship continuation: 100% scholarship requires top 5% merit and CGPA 9.0. 70 to 90% scholarship requires top 10% and CGPA 8.5. 40 to 60% requires top 15% and CGPA 8.0. All scholars must maintain 75% attendance.",
  
    // PLACEMENTS
    "IILM University placement statistics: Highest package is 26 LPA. Average MBA package is 8.6 LPA. Average CTC at Gurugram campus is 7.46 LPA. Top 10% students get 12.45 LPA. Top 25% get 10.89 LPA. Sector distribution: EdTech 24.62%, BFSI 21.54%, Real Estate 13.85%, Consulting 11.54%, IT and ITES 8.46%.",
    "IILM University top recruiters: Biocon, HCL, KPMG, EY, Deloitte, PwC, TCS, L'Oreal, HSBC, HDFC Bank, Asian Paints, Zomato, ITC Limited, Bajaj Allianz, Reliance, Wipro, Amazon, ZARA, BlackRock, Gartner, IBM, Tech Mahindra, Cognizant, Infosys, Flipkart, Dell.",
    "IILM University Career Development Cell uses Dream Reach Settle framework for placements. Services include CV building, mock GD and PI sessions, case interview drills, and 3 tier mentorship with Faculty, Alumni, and Industry mentors. Corporate Readiness Programme prepares students from day one.",
    "IILM University internship: BTech students do mandatory internship at end of each year. MBA students do 8 to 10 week Summer Internship Programme from April to June. Final year students do major capstone or venture studio project. Internships facilitated through CDC.",
  
    // HOSTEL
    "IILM University hostel facility available at both campuses with AC and non-AC options, single double and triple occupancy rooms available on-campus and off-campus including Palm Hostel and Jasmine Hostel. Annual hostel fee ranges from Rs 1,41,000 to Rs 2,05,000 covering rent, mess, WiFi, security, medical, and electricity.",
    "IILM University dining options on campus: Scholars Cafe, Chai Garam, Box Cafe, Campus Collegiate, Smarty Beans, Lecture Break, and upcoming food courts with Haldiram's, Dominos, and Subway.",
  
    // CAMPUS AND FACILITIES
    "IILM University campus facilities: Apple Media Lab, Dell AI Lab, Innovation Lab, Multimedia Studio, Moot Court, Neuro-Cognitive Lab with EEG and biofeedback, Venture Studio, VLSI Lab, Mechatronics Lab, Aerodynamics Lab. Campuses have 7 acre lush green spaces with tech-enabled infrastructure.",
    "IILM University sports facilities: Badminton courts, basketball courts, pickleball courts, tennis courts, volleyball courts, football ground, cricket ground, table tennis, Zumba room, and yoga room.",
    "IILM University library has over 50,000 books, access to IEEE Xplore, Springer, Elsevier and JSTOR databases, e-journals, e-books, and 24 hour reading room facility.",
    "IILM University mental health support: IILM Centre for Emotional Intelligence and iBloom Centre for holistic wellbeing. Partnership with YourDOST provides 24x7 confidential access to over 1,000 expert counselors in 20 plus languages. Dedicated counseling rooms on campus.",
  
    // STUDENT LIFE
    "IILM University has over 20 active student clubs: Academic clubs include Mediosphere, Meraki Design club, Mark Buzz, Kalam Robotics, GDSC Google Developer Student Club. Cultural clubs include Aaghaaz, Thespian Society, Eudaimonia Psychology club, Wevolve, Qasid NGO Club. Innovation clubs include i-FLIE Hub and Innovation Lab. Also Aaroh Debating club, Corporate Club, and Aikyam.",
    "IILM University annual events include cultural fest, technical fest, hackathons, sports tournaments, and national level competitions. Students can participate in national and international conferences and research programmes.",
    "IILM University MBA students receive IILM Student Wallet of Rs 1,00,000 for value-added activities including global and social immersions, online certifications, and professional training with KPMG and EY.",
  
    // FACULTY AND LEADERSHIP
    "IILM University leadership: Justice Hima Kohli is Chairman of School of Law, Mr Bharat Kaushal is Chancellor at Greater Noida, Mr P. Dwarkanath is Chancellor at Gurugram, Dr Harivansh Chaturvedi is Pro-Chancellor, Dr Nihar Amoncar is Director at Greater Noida, Dr Ravi Kumar Jain is Director at Gurugram, Dr Akhil Damodaran is Dean of School of Management.",
    "IILM University student to faculty ratio is approximately 15:1 ensuring personalized attention. Faculty have extensive industry and research experience. Teaching methodology includes Outcome-Based Education, Project-Based Learning, flipped classrooms, case studies, business simulations using CESIM, and live projects.",
  
    // COLLABORATIONS
    "IILM University industry collaborations: IBM for AI and ML with IBM Digital Badges, Microsoft for Cyber Security and Cloud Computing with Azure certifications, Apple for iOS development, AWS Academy, L&T EduTech for Full Stack Development, KPMG for BBA Accounting and Finance, HCL Tech for Cloud Computing, Biocon for Biotechnology.",
    "IILM University global academic collaborations: Aberystwyth University UK, Taylor's University Malaysia, Michigan State University USA, Domus Academy Italy, Woosong University South Korea, Westcliff University USA. These enable student exchange, joint research, and global certifications and international pathways.",
    "IILM University approvals and accreditations: Approved by UGC and AICTE. Recognized by Government of Haryana and Uttar Pradesh. Member of Association of Indian Universities. Follows NEP 2020 guidelines.",
  
    // CURRICULUM
    "IILM University curriculum uses 70 plus GPTs for AI-integrated learning. Pedagogy includes Outcome-Based Education, Project-Based Learning, flipped classrooms, case studies, business simulations with CESIM, and live projects. Semesters 1 and 2 focus on foundation, Semesters 3 to 6 on concentration and career tracks, Semesters 7 and 8 on capstone, global immersion, or startup incubation.",
    "IILM University BTech students receive industry certifications: Azure from Microsoft, IBM Digital Badges from IBM ICE, CompTIA certifications, Oracle Academy certifications, AWS Academy certifications, and L&T EduTech certifications.",
  
    // FAQ
    "IILM University fee payment: EMI and instalment options available. Semester-wise payment accepted. Education loan available through SBI, HDFC, and Axis Bank. Full fees paid first for scholarship students, excess adjusted in Semester 2.",
    "IILM University anti-ragging policy: Zero tolerance for ragging. Punishable by law and expulsion per UGC regulations. 24 hour National Anti-Ragging Helpline: 1800-180-5522 toll free. Support email: helpline@antiragging.in.",
    "IILM University student support: SQUAD Student Query Addressal Division handles rapid academic and administrative support. YourDOST provides 24x7 mental health counseling. Campus medical facility available.",
    "IILM University lateral entry: BTech lateral entry available for diploma holders joining 2nd year directly. BCA lateral entry for Class 12 Computer Science students. Eligibility conditions apply.",
    "IILM University attendance requirement: Minimum 75% attendance required in each subject to appear in exams and maintain scholarships. Students with medical emergencies can apply for attendance relaxation.",
  
]

async function uploadData() {
  console.log("Starting...")
  console.log("Pinecone key exists:", !!process.env.PINECONE_API_KEY)
  console.log("Cohere key exists:", !!process.env.COHERE_API_KEY)

  try {
    const index = pinecone.index("university-bot")

    for (let i = 0; i < universityData.length; i++) {
      const text = universityData[i]
      console.log(`Processing ${i + 1}: ${text.substring(0, 40)}`)

      const response = await cohere.embed({
        texts: [text],
        model: "embed-english-v3.0",
        inputType: "search_document",
        embeddingTypes: ["float"]
      })

      console.log("Got response from Cohere")
      const embedding = response.embeddings.float 
  ? response.embeddings.float[0] 
  : Object.values(response.embeddings)[0]
console.log("Embedding type:", typeof embedding, "Length:", embedding?.length)
      console.log("Embedding length:", embedding.length)

      const finalEmbedding = Array.from(embedding)
console.log("Final type:", typeof finalEmbedding, "Is array:", Array.isArray(finalEmbedding), "Length:", finalEmbedding.length, "Sample:", finalEmbedding.slice(0,3))

const response2 = await fetch(`${process.env.PINECONE_INDEX_HOST}/vectors/upsert`, {
    method: "POST",
    headers: {
      "Api-Key": process.env.PINECONE_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      vectors: [{
        id: `doc-${i}`,
        values: finalEmbedding,
        metadata: { text }
      }]
    })
  })
  console.log("Pinecone response:", response2)

      console.log(`Uploaded ${i + 1}/${universityData.length}`)
    }

    console.log("Done!")
  } catch (err) {
    console.error("Error:", err.message)
  }
}

uploadData()
