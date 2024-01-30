const express=require('express');
const paths =require("path");
const bcrypt =require('bcrypt');
const collection = require("./config");


const app = express();
app.use(express.json());

app.use(express.urlencoded({extended:false}));

app.set('view engine','ejs');


app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/signup",(req,res)=>{
    res.render("signup");

});

app.get("/login",(req,res)=>{
    res.render("login");
});

// register user
app.post("/signup",async(req,res)=>{
    const data={
        name : req.body.username,
        password:req.body.password
    }
 
 
    const existinguser=await collection.findOne({name:data.name});
    if(existinguser){
        res.send("User already exists.Please choose a different ")
    }else{
        // hashing password
        const saltRounds=10        // number of sait rounds for bcrypt
        const hashedPassword=await bcrypt.hash(data.password,saltRounds);

        data.password=hashedPassword;      //replacing hashed password to original password

        const userdata=await collection.insertMany(data);
    console.log(userdata);
    }
    res.render("signup");
})


//login user
app.post('/login',async(req,res)=>{
    try{
         const check=await collection.findOne({name:req.body.username});
         if(!check){
            res.send("User name can't find.");
         }
            //compairing the hashed password with plain text 
            const isPasswoedMatch =await bcrypt.compare(req.body.password,check.password);
            if(isPasswoedMatch){
                res.render('index');
            }else{
                res.send("Wrong password.");
            }
    }catch{
        res.send("Wrong Detail.");

    }
})

const port = 3000;
app.listen(port,()=>{
    console.log('Server running on port ',port);
})



//To run code write in terminal ::   nodemon src/index.js
