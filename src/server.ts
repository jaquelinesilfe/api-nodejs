import 'reflect-metadata'
import express from 'express';
import "./database";

const app = express();

/*  GET => Buscar
    POST => Salvar
    PUT => Alterar
    DELETE => Deletar
    PATCH => Alteração específica
     */


app.get("/", (req, res) => {

    return res.json({message:"Hello World - NLW4"})
});

//1 param => Rota(Recurso, API)
//2 param => request, response

app.post("/", (req, res) => {
    //Recebeu os dados para salvar
    return res.json({message:"Os dados foram salvos com sucesso!"})
})





app.listen(3333, () => console.log("Server is running!"));

