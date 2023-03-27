const express = require('express');
const app = express();
const ListUsers = require('../model/user');
const alert = require('alert'); 

app.get('/',(req,res)=>{
  res.render('home.handlebars') 
})

app.get('/signup', (req, res) => {
  res.render('users/signup.handlebars')
});


    
app.get('/list', (req, res) => {
    ListUsers.find({}).then(user =>{
        res.render('users/ListUse.hbs',{
            user:user.map(user => user.toJSON())
        });
    })
 
});

app.post('/add', (req, res) => {
  console.log(req.body);
  if(req.body.id ==''){
     addRecord(req, res);
     res.redirect('/list');
  }else{
updateRecord(req, res);
  }


    });
function addRecord(req, res){
  const data={
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    files: req.body.files
  }
  ListUsers.insertMany([data]) 
  res.redirect('/list');
}
function updateRecord(req, res) {
  ListUsers.findOneAndUpdate({_id:req.body.id},req.body,{new:true}).then(err=>{
    if(!err){
     
      console.log(err);
      res.render('users/signup.handlebars',{
          viewtitle: 'update User thất bại'
        })
    }else{
     
        res.redirect('/list');
    }
  }
  )
}
app.get("/edit/:id", (req, res) => {
  ListUsers.findById(req.params.id).then((user) => {
    
          res.render('users/signup.handlebars', {
              viewtitle:"UPDATE",
              user:user.toJSON()
            });
      
    
  })
 
 
})


app.get("/del/:id",async (req, res) => {
  try{
      const user = await ListUsers.findByIdAndDelete(req.params.id,req.body);
      if(!user) res.status(404).send("không tìm thấy item xóa");
      else{
          res.redirect("/list");
      }
      res.status(200).send();

  }catch(error) {
      res.status(500).send(error);
  }
  });



  app.post('/login', async (req, res) => {

    try {
        const check = await ListUsers.findOne({ email: req.body.email })

        if (check.password === req.body.password) {
            res.status(201).render('users/ListUse.hbs', { naming: `${req.body.password}+${req.body.email}` })
        }
        else {
            res.send("sai password")
        }
    } catch (e) {
    
    alert("Email bạn vừa nhập chưa được đăng ký!?");
        

    }
});
module.exports = app;
