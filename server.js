'use strict';

const express = require('express');
const morgan = require('morgan');
const envVars = require('dotenv').config();


const { users } = require('./data/users');


let currentUser;
// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};


const handleHomePage = (req, res) => 
{
   console.log(currentUser);
  res.status(200).render('pages/homepage', {users:users, currentUser:currentUser});
}

const handleUserPage = (req, res) => 
{
  const userParam = req.params.user;

  console.log(userParam);

  let single_user = users.find(element => element._id === userParam);

  let friends = users.filter( user => single_user.friends.includes(user._id)
  );

  res.status(200).render('pages/profile', {user:single_user, friends: friends, currentUser:currentUser});
}

const handleName = (req, res) => 
{
  const firstName = req.query.firstName;


  let single_user = users.find(element => element.name === firstName);

  if (single_user === undefined)
  {

    res.status(404).redirect('/signin');
  }
  else
  {
    currentUser = single_user;
    let friends = users.filter( user => single_user.friends.includes(user._id)
    );
  
    res.status(200).render('pages/profile', {user:single_user, friends: friends, currentUser:currentUser});
  
  }
}





const handleSignIn = (req, res) => 
{

  if (currentUser == undefined)
  {
  res.status(200).render('pages/signon', {currentUser:currentUser});
  }
  else
  {
    res.status(200).render('pages/homepage', {users:users, currentUser:currentUser});

  }
}


// -----------------------------------------------------
// server endpoints
express()
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // .set('port', process.env.PORT || 8000);
    // endpoints

  .get("/", handleHomePage)

  .get("/users/:user", handleUserPage)

  .get("/signin", handleSignIn)

  .get("/getname", handleName)

  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(80, () => console.log('Listening on port 8000'));

