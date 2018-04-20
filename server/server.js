//I do not have a Heroku yet
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');
const _ = require('lodash');
const {Dog} = require('./models/dog.js');

const app = express();

//hbs setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../app/views'))
hbs.registerPartials(path.join(__dirname, '../app/views/partials'))

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
    res.render('./dogs/new.hbs', {
      name: dog.name,
      age: dog.age,
      action: `/dogs/${dog.id}`,
      method: "put"
    });
  })
  .catch((e) => {
    res.send("Dog does not exist");
  })
})

app.put('/dogs/:id', (req, res) => {
  Dog.findByIdAndUpdate(req.params.id, )//https://coursework.vschool.io/mongoose-crud/
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})

// {
// 	"name": "Testboi"
// 	"age": "3"
// }
