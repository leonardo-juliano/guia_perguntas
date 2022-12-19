//importando os modulos
const express = require("express");
const app = express();
const bodyParser = require("body-parser"); 
const connection = require("./database/database"); 
const Pergunta = require("./database/Pergunta"); //representa a tabela de perguntas
const Resposta = require("./database/Resposta");

//conexão com o banco de dados
connection
    .authenticate()
    .then(()=>{
    console.log("conexão feita com sucesso");
    })
    .catch((msgErro)=>{
    console.log(msgErro)
    });

//usando o ejs como view engine
app.set('view engine', 'ejs');

//utilizando o borderParser para pegar as informacoes do formulario
app.use(bodyParser.urlencoded({extend: false})) //permite que a pessoa envie os dados no formulario e o body parser traduz para JS, decodifica os dados enviado
app.use(bodyParser.json());

//listando os dados do backend
app.get("/", (req, res)=>{ 
    Pergunta.findAll({raw: true, order:[
        ['id','DESC'] //desc = decrescente, ASC = crescente a ordem de vizualização 
    ]}).then(pergunta =>{
        res.render("home",{
            pergunta : pergunta
        });
    });   
});

app.get("/perguntar", (req, res)=>{
    res.render("perguntar");
});

//enviando a pergunta para o banco de dados
app.post("/enviarPergunta", (req, res)=>{
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    Pergunta.create({ //este metodo é equivalente ao INSERT INTO...., então esta pegando o model pergunta e inserindo os dados passando em json
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    });
});

//redirecionando para a pagina da pergunta
app.get("/pergunta/:id",(req, res)=> {
    let id = req.params.id
    Pergunta.findOne({
        where: {id : id}
    }).then(pergunta =>{
        if( pergunta != undefined){
            
            Resposta.findAll({
                where: {perguntaId : pergunta.id}
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas:respostas
                });
            });

        }else{
            res.redirect("/")
        }
    });
    
});

app.post("/responder",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId : perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId)
    });
});

//utilizando o express.static para utilizar css, img no projeto
app.use(express.static('public'));


//ligando o servidor
app.listen(8080,()=>{
    console.log("app rodando")
})