const { Pinecone } = require("@pinecone-database/pinecone")
const { CohereClient } = require("cohere-ai")
require("dotenv").config({ path: "../backend/.env" })

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY })

const universityData = [
  "IILM University has two campuses: Gurugram (Plot No. 69-71, Golf Course Road, Sector 53, Gurugram, Haryana 122003) and Greater Noida (Plot No. 16-18, Knowledge Park II, Greater Noida, UP 201306).",
  "IILM University website is www.iilm.edu. General enquiries email for Gurugram: admissions.iilmu@iilm.edu and for Greater Noida: admissions.gn@iilm.edu",
  "IILM University contact numbers: MBA: +91-8065905223, UG: +91-8065905224, Engineering Gurugram: +91-8065905221, Engineering Greater Noida: +91-8065905220, BBA: +91-8065905222, PG Non-MBA: +91-8065905225",
  "At Greater Noida campus, BBA (Hons) fee is ₹2,50,000 per year, total ₹10,00,000 for 4 years. BBA Management Technology with HCL is ₹2,50,000 per year. BBA Accounting & Finance with KPMG is ₹2,75,000 per year, total ₹11,00,000.",
  "At Greater Noida campus, BA LLB (Hons) and BBA LLB (Hons) fee is ₹2,40,000 per year for 5 years, total ₹12,00,000. LLB (Hons) is ₹1,50,000 per year for 3 years, total ₹4,50,000.",
  "At Greater Noida campus, BTech CSE fee is ₹2,25,000 per year, total ₹9,00,000 for 4 years. BTech CSE with IBM is ₹2,75,000 per year, total ₹11,00,000. BTech CSE with Apple is ₹2,75,000 per year, total ₹11,00,000.",
  "At Greater Noida campus, BTech CSE with Microsoft is ₹2,55,000 in year 1 then ₹2,25,000 per year, total ₹9,30,000. BTech CSE Full Stack with L&T is ₹2,55,000 per year, total ₹10,20,000. BCA is ₹2,00,000 per year, total ₹8,00,000.",
  "At Greater Noida campus, BTech in Biotechnology, Bioinformatics, Electrical, Electronics, Semiconductor, Food Technology, Mechanical Engineering, Robotics and AI are all ₹2,00,000 per year, total ₹8,00,000 for 4 years.",
  "At Greater Noida campus postgraduate, MBA fee is ₹12,40,000 total for 2 years. MTech CSE, Bioinformatics, Biotechnology, Electronics, Mechanical, Semiconductor are ₹1,20,000 per year, total ₹2,40,000. MCA is ₹1,50,000 per year, total ₹3,00,000. LLM is ₹2,00,000 for 1 year.",
  "At Gurugram campus, BTech CSE fee is ₹3,00,000 per year, total ₹12,00,000 for 4 years. BTech AI is ₹3,50,000 per year, total ₹14,00,000. BTech CSE with Xebia and Microsoft is ₹3,30,000 per year, total ₹13,20,000.",
  "At Gurugram campus, BA LLB Hons and BBA LLB Hons fee is ₹3,50,000 per year for 5 years, total ₹17,50,000. BBA Hons is ₹4,50,000 per year, total ₹18,00,000.",
  "At Gurugram campus, BA Hons Psychology, Journalism, Corporate Communication, B Des Interior Design, Fashion Design, Digital Product Design are all ₹4,00,000 per year, total ₹16,00,000.",
  "At Gurugram campus postgraduate, MBA fee is ₹12,90,000 total. MA/MSc Clinical Psychology and MTech Generative AI are ₹2,50,000 per year, total ₹5,00,000. LLM is ₹2,50,000 for 1 year.",
  "IILM University MBA scholarship based on CAT/XAT percentile: 95 and above gets 100%, 90-94 gets 80%, 85-89 gets 60%, 80-84 gets 40%, 70-79 gets 20%, 60-69 gets 10%.",
  "IILM University BTech scholarship based on JEE Main scores: 96-100 percentile gets 100%, 86-95 gets 40%, 76-85 gets 30%, 71-75 gets 25%, 66-70 gets 20%, 60-65 gets 10%.",
  "IILM University scholarships based on CUET scores: 95 and above percentile gets 40%, 90-94.99 gets 30%, 80-89.99 gets 20%, 75-79.99 gets 10%.",
  "IILM University Gurugram campus Class 12 scholarships: 98% and above gets 100%, 90-97.99% gets 50%, 85-89.99% gets 30%, 76-84.99% Engineering gets 20%, 65-75.99% Engineering gets 10%.",
  "IILM University Greater Noida campus Class 12 scholarships: 96% and above gets 100%, 90-95.99% gets 50%, 86-89.99% gets 30%, 76-85.99% gets 20%, 65-75.99% gets 10%.",
  "IILM University Law scholarship based on CLAT or LSAT: 99 percentile and above gets 100%, 95-98.99 gets 50%, 80-94.99 gets 20%.",
  "IILM University Sports Scholarship: International participants get 100%, National Gold/Silver/Bronze get 50%, other national participants get 25%. Must be 23 years or younger and have participated minimum 3 years.",
  "IILM University Martyr's Scholarship: 100% tuition fee waiver for wards of martyrs from Army, Navy, Air Force, Assam Rifles, CRPF, BSF, ITBP, CISF, SSB, State Police, Indian Coast Guard, Special Frontier Force.",
  "IILM University fee waivers: 10% for girls with family income less than 8 lakhs. 10% for students from Kashmir and North East India. 10% for children of defence personnel. 30% for students from Nepal. 10% for siblings of enrolled students.",
  "IILM University Haryana Domicile concession: Class 12 with 90% and family income less than 3 lakhs gets 100%. Class 12 with 80% and income less than 6 lakhs gets 50%. Class 12 with 75% and income less than 8 lakhs gets 25%. 25% seats reserved for Haryana students.",
  "IILM University scholarship rules: Only one scholarship allowed at a time. Scholarships apply only on tuition fee not boarding. Deadline August 31 2026. Limited seats first come first served. Full fees paid initially, excess adjusted in Semester 2.",
  "IILM University BTech CSE specialisations at Greater Noida: AI-ML, Data Science and Big Data Analytics, Cyber Security, Cloud Computing, Graphics and Gaming, AI-ML with IBM, Cyber Security with Microsoft, Cloud Computing with Microsoft, Full Stack with L&T EduTech, iOS with SKLZ TECT LLP.",
  "IILM University BTech CSE specialisations at Gurugram: AI-ML with L&T, Cyber Security and Digital Forensics with HCL, Full Stack with L&T, Data Science with Xebia and Microsoft, Cloud Computing with HCL, Immersive Technologies, Data Engineering with Xebia and Microsoft, Generative AI with Xebia, Robotic Intelligence with L&T, BTech in Artificial Intelligence.",
  "IILM University postgraduate CSE: MTech Generative AI and Robotics and Machine Intelligence at Greater Noida. MTech Generative AI at Gurugram. MCA at Greater Noida. PhD in Computer Science and Engineering available.",
  "IILM University campus recruiters include Deloitte, KPMG, PwC, HDFC Bank, Kotak, Reliance, Gartner, TCS, Flipkart, Wipro, HCL, Tech Mahindra, Zomato, HSBC, Cognizant, Infosys, EY, Dell, BlackRock, L'Oreal, Asian Paints, Mamaearth.",
  "IILM University infrastructure: AI and Cognitive Computing Lab, Cloud Infrastructure and DevOps Lab, Cyber Security and Digital Forensics Lab, Robotics and Automation Lab, Immersive Reality Lab, Full Stack Development Lab, Data Engineering and Data Science Lab, Semiconductor Devices Lab.",
  "IILM University vision is to be India's most innovative university preparing leaders with purpose. Mission is to empower diverse learners through AI-integrated education and real-world experiences."
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
