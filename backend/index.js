const express = require("express")
const cors = require("cors")
const { Pinecone } = require("@pinecone-database/pinecone")
const { GoogleGenerativeAI } = require("@google/generative-ai")
const Cerebras = require("@cerebras/cerebras_cloud_sdk")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

// Initialize services
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const cerebras = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY })

// Health check
app.get("/", (req, res) => {
  res.json({ message: "University chatbot backend is running!" })
})

// Main chat endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body

    if (!question) {
      return res.json({ answer: "Please ask a question!" })
    }

    // Step 1 - Convert question to embedding
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" })
    const embeddingResult = await embeddingModel.embedContent(question)
    const questionEmbedding = embeddingResult.embedding.values

    // Step 2 - Search Pinecone
    const index = pinecone.index("university-bot")
    const searchResults = await index.query({
      vector: questionEmbedding,
      topK: 3,
      includeMetadata: true
    })

    // Step 3 - Extract context
    const context = searchResults.matches
      .map(match => match.metadata.text)
      .join("\n")

    // Step 4 - Ask Cerebras
    const response = await cerebras.chat.completions.create({
      model: "llama-3.3-70b",
      messages: [
        {
          role: "system",
          content: `You are a helpful university admissions assistant.
          Answer only based on this context:
          ${context}
          If the answer is not in the context, say "Please contact the admissions office for this information."`
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