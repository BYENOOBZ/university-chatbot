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
        topK: 3,
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
          content: `You are a helpful IILM University admissions assistant.
          Answer only based on this context:
          ${context}
          If the answer is not in the context, say "Please contact the admissions office at admissions@iilm.edu or call +91-8065905224 for more information."`
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
