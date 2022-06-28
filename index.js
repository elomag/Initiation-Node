const express = require('express')
const mongoose = require('mongoose')
const Livres = require('./livres')

const bodyParser = require('body-parser')   // peut être commenté (idem ligne 17) et remplacé par lignes 18 & 19

mongoose.connect(
    'mongodb+srv://Elo:1234@cluster0.bg2bzb7.mongodb.net/biblio?retryWrites=true&w=majority'
    , err => {
        if (err) throw 'erreur est : ', err;
        console.log('connected to MongoDB')
    });

const app = express();
const port = 8080;

app.use(bodyParser.json());                 // averti qu'on peut utiliser des données de type .json dans le Body
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log("ça marche bien!!!");
})

// METHODE GET pour AFFICHAGE sur PAGE.html
// app.get('/',function(req, res){
//     res.send('Hello world !')
// })

//METHODE POST pour créer de nouveaux objets dans la Collection
app.post('/', async (req, res) => {
    const titre = req.body.titre   // récupération des variables du body
    const auteur = req.body.auteur
    const genre = req.body.genre

    // res.send("méthode POST OK!!!")

    const nouveau_livre = new Livres({  // création d'un objet représentant notre nouveau livre
        titre: titre,
        auteur: auteur,
        genre: genre
    })

    await nouveau_livre.save()          // sauvegarde asynchrone du nouveau livre, càd attend que la modif soit faite pour synchroniser
    res.json(nouveau_livre)
    return
})

// METHODE GET sans paramètre (récupère toute la collection)
app.get('/', async (req, res) => {
    const livres = await Livres.find() // On récupère tous les livres : pas de paramètre dans la fonction find
    res.json(livres)
})

// METHODE GET by Id
app.get('/:id', async (req, res) => {   // On renseigne l'_id en paramètre dans la route
    const id = req.params.id            // On récupère la valeur de l'_id dans les paramètres
    const livre = await Livres.findOne({ _id: id }) // on récupère le livre grâce à la méthode findOne ayant comme paramètre _id
    res.json(livre)
})

// METHODE DELETE (by Id)
app.delete('/:id', async(req, res) => {
    const id = req.params.id
    const suppr = await Livres.deleteOne({_id : id})
    res.json(suppr)
})

// METHODE PATCH (by Id)
app.patch('/:id', async(req, res) => {
    const id = req.params.id
    const livre = await Livres.findOne({_id : id}) // on récupere le livre pour pouvoir le modifier
     
    // on récupère les valeurs potentiellement modifiées
    const titre = req.body.titre;
    const auteur = req.body.auteur
    const genre  = req.body.genre;
     
    // on vérifie maintenant si les valeurs sont remplies; si elles le sont, on modifie l'ancienne valeur par la nouvelle
    if (titre) {
        livre.titre = titre
    }
    if (auteur) {
        livre.auteur = auteur
    }
    if (genre) {
        livre.genre = genre
    }
     
    await livre.save()          // on sauvegarde les modifications
    res.json(livre)
})

