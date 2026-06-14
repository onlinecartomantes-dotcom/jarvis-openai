require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

const conversation = [];

app.get("/", (req, res) => {

  res.json({
    status: "online",
    service: "JARVIS"
  });

});

app.post("/api/chat", async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({
        reply: "Mensagem vazia."
      });

    }

    conversation.push({
      role: "user",
      content: message
    });

    if (conversation.length > 20) {
      conversation.splice(0, conversation.length - 20);
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: `
Você é J.A.R.V.I.S.

Fale em português do Brasil.
Responda de forma natural.
Use frases curtas.
Evite listas longas.
Seja rápido e conversacional.
Soe como um assistente de voz inteligente.
`,
      input: conversation.map(item => ({
        role: item.role,
        content: item.content
      }))
    });

    const reply =
      response.output_text ||
      "Desculpe, não consegui responder.";

    conversation.push({
      role: "assistant",
      content: reply
    });

    res.json({
      reply
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "Erro ao acessar OpenAI."
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Servidor iniciado na porta ${PORT}`
  );

});
