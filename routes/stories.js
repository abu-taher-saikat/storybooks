const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const User = mongoose.model('users')
const {ensureAuthenticated, ensureGuest} = require('./../helpers/auth');
const Stories = require('../models/Story');
// const User = require('../models/User');

// Stories index
router.get('/',(req, res)=>{
    try{
        Stories.find({status : 'public'})
        .populate('user')
        .then(stories =>{
            res.render('stories/index',{
                stories : stories
            });
    
        });
    }catch(err){
        console.log(err);
        
    }
});

// Show single story
router.get('/show/:id',(req, res)=>{
    Stories.findOne({
        _id : req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(story =>{
        res.render('stories/show',{
            story : story
        })
    })
})
// Show single story
router.get('/show/:id',(req, res)=>{
    Stories.findOne({
        _id : req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(story=>{
        res.render('stories/show',{
            story : story
        })
    })
})

// Add Story form
router.get('/add', ensureAuthenticated,(req, res)=>{
    res.render('stories/add');
})

// edit story form
    router.get('/edit/:id', ensureAuthenticated,(req, res)=>{
        Stories.findOne({
            _id : req.params.id
        })
        .then(story =>{
            res.render('stories/edit',{
                story : story
            });
        });
    });


// Process add story 
router.post('/', async (req, res)=>{
    // console.log(req.body);
    // res.send('hellow');
    try{
        let allowComments;
        if(req.body.allowComments){
            allowComments = true;
        }else{
            allowComments = false;
        }
    
        const newStory = {
            title : req.body.title,
            body : req.body.body,
            status : req.body.status,
            allowComments : allowComments,
            user : req.user.id
        }
    
        // create story 
        await new Stories(newStory)
        .save()
        .then(story =>{
            res.redirect(`stories/show/${story.id}`);
        })

    }catch(err){
        console.log(err);
    }
    
})

// Edit from process (put)
router.put('/:id',async(req, res)=>{
    try{
        // res.send('put');
        await  Stories.findOne({
            _id : req.params.id
        })
        .then(story =>{
            let allowComments;
            if(req.body.allowComments){
                allowComments = true
            }else{
                allowComments = false
            }
   
   
           //  new values 
           story.title = req.body.title,
           story.body = req.body.body,
           story.status = req.body.status,
           story.allowComments = allowComments
   
           story.save()
           .then(story =>{
               res.redirect('/dashboard');
           })
        });

    }catch(err){
        console.log(err);
    }
});


// Delete story 
router.delete('/:id',(req, res)=>{
    Stories.deleteOne({_id : req.params.id})
    .then(()=>{
        res.redirect('/dashboard')
    })
})

// Add comment
router.post('/comment/:id', (req, res) => {
    Stories.findOne({
      _id: req.params.id
    })
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }
  
      // Add to comments array
      story.comments.unshift(newComment);
  
      story.save()
        .then(story => {
          res.redirect(`/stories/show/${story.id}`);
        });
    });
  });
module.exports = router;