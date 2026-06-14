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

app.get("/", (req,res)=>{

res.json({
status:"online",
service:"JARVIS"
});

});

app.post("/api/chat", async (req,res)=>{

try{

const { message } = req.body;

const response =
await client.responses.create({
model:"gpt-5-mini",
input:message
});

res.json({
reply:response.output_text
});

}catch(error){

console.error(error);

res.status(500).json({
reply:"Erro ao acessar OpenAI."
});

}

});

const PORT =
process.env.PORT || 3000;

app.listen(PORT, ()=>{

console.log(
`Servidor iniciado na porta ${PORT}`
);

});