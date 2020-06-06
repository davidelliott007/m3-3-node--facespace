'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');


let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};


const handleHomePage = (req, res) => 
{
  res.status(200).render('pages/homepage', {users:users})
}

const handleUserPage = (req, res) => 
{
  const userParam = req.params.user;

  console.log(userParam);

  let single_user = users.find(element => element._id === userParam);


  res.status(200).render('pages/profile', {user:single_user});
}



// -----------------------------------------------------
// server endpoints
express()
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

    // endpoints

  .get("/", handleHomePage)


  .get("/users/:user", handleUserPage)

  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));

