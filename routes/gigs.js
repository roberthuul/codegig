const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/', (req, res) => Gig.findAll()
.then(gigs => { 
    gigs.forEach(element => {
        console.log('element',element.dataValues.title);
    });
    res.render('gigs', {
        gigs
    });
})
.catch(err => console.log('viga', err)));

router.get('/add', (req, res) => {
    let error = [];
    res.render('add', {
        error, title: '', technologies: '', budget: '', description: '', contact_email: ''
    });
})


router.post('/add', (req, res) => {
    let {title, technologies, budget, description, contact_email} = req.body;
    let error = [];
    if(!title) {
        error.push({text: 'Please add a title'});
    }
    if(!technologies) {
        error.push({text: 'Please add some technologies'});
    }
    if(!budget) {
        error.push({text: 'Please add a budget'});
    }
    if(!description) {
        error.push({text: 'Please add a description'});
    }
    if(!contact_email) {
        error.push({text: 'Please add an e-mail'});
    }
    if(error.length > 0) {
        res.render('add', {
            error, title, technologies, budget, description, contact_email
        })
    } else {
        if(!budget) {
            budget = 'Unknown';
        } else {
            budget = `€${budget}`;
        }
        technologies = technologies.toLowerCase().replace(/, /g, ',');
        Gig.create({
            title,
            technologies,
            budget,
            description,
            contact_email 
        })
        .then(gig => res.redirect('/gigs'))
        .catch(err => console.log(err));
    }
});

router.get('/search', (req, res) => {
    let { term } = req.query;
    term = term.toLowerCase();
    Gig.findAll({ where:  { technologies: { [Op.like]: '%' + term + '%'}}})
    .then(gigs => res.render('gigs', {gigs}))
    .catch(err => console.log(err));
})

module.exports = router;