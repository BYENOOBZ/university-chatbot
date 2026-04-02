
const express = require("express")
const cors = require("cors")
const { Pinecone } = require("@pinecone-database/pinecone")
const { CohereClient } = require("cohere-ai")
const Cerebras = require("@cerebras/cerebras_cloud_sdk")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

// Initialize services
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY })
const cerebras = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY })

// Health check
app.get("/", (req, res) => {
  res.json({ message: "IILM University chatbot backend is running!" })
})

// Main chat endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body

    if (!question) {
      return res.json({ answer: "Please ask a question!" })
    }

    // Step 1 - Convert question to embedding using Cohere
    const embedResponse = await cohere.embed({
      texts: [question],
      model: "embed-english-v3.0",
      inputType: "search_query",
      embeddingTypes: ["float"]
    })

    const questionEmbedding = Array.from(
      embedResponse.embeddings.float
        ? embedResponse.embeddings.float[0]
        : Object.values(embedResponse.embeddings)[0]
    )

    // Step 2 - Search Pinecone using REST API
    const searchResponse = await fetch(`${process.env.PINECONE_INDEX_HOST}/query`, {
      method: "POST",
      headers: {
        "Api-Key": process.env.PINECONE_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        vector: questionEmbedding,
        topK: 10,
        includeMetadata: true
      })
    })

    const searchData = await searchResponse.json()

    // Step 3 - Extract context
    const context = searchData.matches
      .map(match => match.metadata.text)
      .join("\n")

    // Step 4 - Ask Cerebras
    const response = await cerebras.chat.completions.create({
      model: "llama-3.1-8b",
      messages: [
        {
          role: "system",
          content: `You are Admon, a friendly and knowledgeable admissions assistant for IILM University Gurugram campus.

          PRIMARY CAMPUS: Gurugram. Only mention Greater Noida if user specifically asks.
          
          RESPONSE FORMAT RULES (VERY IMPORTANT):
          - Always use proper markdown formatting
          - For lists ALWAYS use "- item" format (hyphen then space then text), never use bullet symbols like •
          - Use **bold** for important numbers, percentages and key terms
          - Use tables when comparing multiple fees or scholarship percentages
          - For scholarship/fee questions, always give the COMPLETE data from context, not a summary
          
          ANSWER LENGTH:
          - General questions (what programmes, how to apply): 3-4 lines max
          - Specific questions (fees, scholarships, eligibility): Give COMPLETE detailed answer with all data points
          
          STRICT RULES:
          1. ONLY answer IILM University related questions
          2. For unrelated questions say: "I can only help with IILM University Gurugram admissions queries 😊"
          3. NEVER make up or approximate numbers — copy exact figures from context
          4. NEVER use • symbol for bullets, always use - 
          5. If info not in context: "Please contact us at admissions.iilmu@iilm.edu or +91-8065905221"
          6. NEVER mention PhD in CSE as a programme option when listing general programmes — only mention it if user specifically asks about PhD or research programmes.
          7. When listing programmes, always mention BTech CSE first as it is the primary engineering programme.
          8.When user asks about "programmes" or "courses", NEVER include PhD in the list. PhD is only for research scholars, not regular students. 
          Only mention PhD if user specifically asks about "PhD" or "research programmes" or "doctoral programmes".
          9. For scholarship questions copy EXACT numbers from context:
           - Class 12 board Gurugram: 98%+ = 100%, 90-97.99% = 50%, 85-89.99% = 30%, 76-84.99% = 20%, 65-75.99% = 10%
           - JEE Main: 96-100 = 100%, 86-95 = 40%, 76-85 = 30%, 71-75 = 25%, 66-70 = 20%, 60-65 = 10%
           - CUET: 95+ = 40%, 90-94.99 = 30%, 80-89.99 = 20%, 75-79.99 = 10%
           - Sports: International = 100%, National medal = 50%, National = 25%
          10. NEVER add disclaimers like "subject to change" or "please note". Just give the answer directly.
          11. NEVER approximate numbers. Copy exact brackets from context.
          
          Context from IILM University data:
          ${context}
          
          Format example for scholarships:
          **Scholarship criteria:**
          - 96-100 percentile: **100% scholarship**
          - 86-95 percentile: **40% scholarship**

Remember: If it's not in the context, don't make it up!`
        },

        {
          role: "user",
          content: question
        }
      ]
    })

    const answer = response.choices[0].message.content
    res.json({ answer })

  } catch (error) {
    console.error(error)
    res.json({ answer: "Something went wrong. Please try again." })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
