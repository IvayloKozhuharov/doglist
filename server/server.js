//I do not have a Heroku yet
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');
const _ = require('lodash');
const {Dog} = require('./models/dog.js');
const methodOverride = require('method-override');

const app = express();

//hbs setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../app/views'))
hbs.registerPartials(path.join(__dirname, '../app/views/partials'))
app.use(methodOverride('_method'));

//Setup
const port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
const database = process.env.MONGODB_URI || 'mongodb://localhost:27017/Doglist'
mongoose.connect(database)
  .then(() => {
    console.log('connected to database');
  })
  .catch(() => {
    console.log('unable to connect to database');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req, res) => {
  res.redirect('/dogs')
  // res.send('GET /')
})

app.get('/dogs', (req, res) => {
  Dog.find()
    .then(dogs => {
      res.send(dogs)
    })
    .catch(e => {
      res.status(404).send()
    })
})

app.get('/dogs/new', (req, res) => {
  res.render('./dogs/new.hbs', {
    name: "",
    age: "",
    action: "/dogs",
    method: "post"
  });
})

app.post('/dogs', (req, res) => {
  // console.log(req.body);
  // if (req.body.name || !req.body.age) {
  //   res.status(400).send()
  // }
  // const dog = new Dog({
  //   name: "Jasper",
  //   age: 2
  // })
  // dog.save()
  //   .then(dog => {
  //     res.send(dog);
  //   })
  //   .catch(e => {
  //     res.status(400).send();
  //   })
  let dog = new Dog({
    name: req.body.name,
    age: req.body.age
  })
  dog.save()
    .then(dog => {
      res.send(dog);
    })
    .catch(e => {
      res.status(400).send();
    })
    console.log("Created");
    res.redirect('/dogs')
})

app.get('/dogs/:id', (req,res) => {
  console.log(req.params.id);
  Dog.findById(req.params.id)
  .then((dog) => {
    res.send(dog);
  })
  .catch((e) => {
    res.send("Dog does not exist");
  })
})

app.get('/dogs/:id/edit', (req, res) => {
  Dog.findById(req.params.id)
  .then((dog) => {
    res.render('./dogs/edit.hbs', {
      name: dog.name,
      age: dog.age,
      id: dog.id
    });
  })
  .catch((e) => {
    res.send("Dog does not exist");
  })
})

app.put('/dogs/:id', (req, res) => {
  const id = req.params.id;
  Dog.findByIdAndUpdate(id, {
    name: req.body.name,
    age: req.body.age
  }, {new: true}).then(dog => {
    console.log("dog:", dog);
  }).catch(e => {
    console.log("error from PUT");
  })
  res.redirect('/dogs');
})

app.delete('/dogs/:id', (req, res) => {
  const id = req.params.id;
  Dog.findByIdAndRemove(id)
    .then(result => {
      console.log("result: " + result);
    })
    .catch(e => {
      console.log("Could not find the dog you wanted to delete");
    })
    res.redirect('/dogs');
})

// (results) => {
//   console.log(results);
// })//https://coursework.vschool.io/mongoose-crud/
// console.log("Edited");
// app.redirect('/dogs');

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})

// {
// 	"name": "Testboi"
// 	"age": "3"
// }
