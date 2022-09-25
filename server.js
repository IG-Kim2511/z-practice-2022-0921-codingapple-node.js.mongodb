const express = require("express");
const app = express();

// colors
let colors = require("colors");

//bodyParser 
let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// dotenv
require('dotenv').config()

// mogoClient
let MongoClient = require('mongodb').MongoClient;

// ejs
// let ejs = require('ejs'); 👉documnet에 있는 사용법인데 아직 이해못했음
app.set('view engine','ejs')

// c50) static 파일 보관위해 public폴더 씀. html에서 경로설정할 때 root폴더에 보관된 것처럼 경로 설정함
app.use(express.static('public'))

// method-override
let methodOverride = require('method-override')
app.use(methodOverride('_method'))








// 🍀get, post, put, delete

// 🍀get
app.get("/", function (req, res) {
  //res.send('ig node server')
  
  // html
  // res.sendFile(__dirname + "/index.html");

  //🦄c50. ejs : html과 달리 render(~) 라는거 헷갈리지 말기
  // 👉index.ejs
  res.render('index.ejs')

});

app.get("/style.css", function (req, res) {
  res.sendFile(__dirname + "/style.css");
});

app.get("/write", function (req, res) {
    //res.send('ig node server')
    // res.sendFile(__dirname + "/write.html");

    res.render('write.ejs')
});


// 🦄🦄c28 

let url = process.env.mongoDB_url;

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  console.log("ig-Database created!");

  let db = client.db('db0921')

  // 🍀post, bodyParser
  app.post('/add',function (req,res) {    
    // res.send('/add, 전송완료')
    // res.sendFile(__dirname + "/write.html");
    res.render('write.ejs')


    console.log('add fin')

    console.log(req.body)
    console.log(req.body.ig_title)


    // 🍀c38.findOne, total count
    db.collection('counter').findOne({name:'total post count'},function (err,pp_res) {
      console.log(pp_res)
      console.log(pp_res.totalPost)
      
        // 🍀insertOne, _id: pp_res.totalPost+1
      db.collection('co0921').insertOne({_id:pp_res.totalPost+1,title: req.body.ig_title, date:req.body.ig_data },function (){
        console.log('insertone success'.blue)      

        // 🍀c40.updateOne, $inc:{totalPost:1}
        db.collection('counter').updateOne({name:'total post count'},{$inc:{totalPost:1}},function (PPP_err,ppp_res) {
          if (PPP_err) {
            return console.log(PPP_err)            
          } 
          
        });
      })
    });

  })
  
  // list
  app.get("/list", function (req, res) {

    // find().toArray()
    db.collection('co0921').find().toArray(function (err,pp_res) {
      console.log(pp_res)
      
      // ejs
      //res.render
      res.render('list.ejs',{ig_posts:pp_res});
    })

  });


  // 🍀c42, delete
  app.delete('/delete', function (req,res) {
    
    console.log(req.body)

    req.body._id = parseInt(req.body._id);
    db.collection('co0921').deleteOne(req.body, function (pp_err, pp_res) {
         console.log('ig delete fin')

      res.status(200).send({message:"ig delete fail"});
    })
    
  });



  // 🍀c48. 👉/views/detail.ejs

  app.get('/detail/:id',function (req,res) {
    db.collection('co0921').findOne({_id: parseInt(req.params.id)},function (pp_err,p_res) {
      console.log(p_res)
      res.render('detail.ejs',{ig_data: p_res})      
    });    
  });

  // 🦄🦄c52. update.ejs, update-id.ejs
  /* 
    1 'update' - 'update-id'페이지 따로만듬
    2. app.get()도 따로 만듬
    에러없이 정상작동됨
  */
  app.get("/update", function (req, res) {
    res.render('update.ejs')
  });

  // 🍀 /update/:id
  app.get("/update/:id", function (req, res) {
    db.collection('co0921').findOne({_id: parseInt(req.params.id)},function (pp_err, p_db결과) {    
        
      console.log(p_db결과)
      res.render('update-id.ejs',{ig_post: p_db결과})      
    })
  });


  // 🦄🦄🦄c54, 👉update-id.ejs

  app.put('/update-id',function (req,res) {

    console.log(res.body)

    db.collection('co0921').updateOne({_id:parseInt(req.body.ig_id)},{$set:{title: req.body.ig_title, date: req.body.ig_date}},function (p_err, p_res) {
      console.log('ig- update- fin')

      // 🍀redirect
      // res.render('list.ejs'); 로 하면 에러남 (왜인지는 모름)
      res.redirect('/list');
    })
  });


  // 🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄
  // 🦄🦄🦄🦄🦄🦄🦄🦄여기부터 필기노트 옮김🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄🦄
  console.log('🦄🦄여기부터 필기노트 옮김')


// 🦄🦄c56 (회원 로그인0) 세션, JWT, OAuth 등 회원인증 방법 이해하기
// 🦄🦄c58 (회원 로그인1) 미들웨어, app.use(~), passport, express-session, passport.authenticate(~),passport.use(new LocalStorategy(~))

// 🦄🦄c60 (회원 로그인2) 아이디 비번을 DB와 비교하고 세션 만들어주기, passport.serializeUser(~)
// 🦄🦄c62 (회원 로그인3) 로그인 유저만 접속할 수 있는 페이지 만들기
console.log('🦄🦄c56,58,60,62')

// 👉login_c58.ejs


// 🍀c58-10)
// passport
const passport = require('passport');

// passport-local
const LocalStrategy = require('passport-local').Strategy;

// express-session
const session = require('express-session');

// middleware
app.use(session({ secret: 'ig123', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/login',(req,res)=>{
  res.render('login_c58.ejs');
});


app.get('/login_fail',function (req,res) {
  res.render('login_fail.ejs')    
})


// 🍀assport
/*🍀-20)
  passport.authenticate('local') : (인증해주세요)함수 ,    
  인증 실패시 (failureRedirect : '/fail') :  '/login_fail' 로 연결 
  인증 성공시 : res응답.redirect('/') 
*/
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login_fail' }),
  function(req, res) {
    console.log('🦄c58. login')
    res.redirect('/');
  });


// 🍀passport-local
// 🍀c60-30) passport.authenticate('local',~)...로그인 성공시, 다음코드 실행됨
passport.use(new LocalStrategy(
  {
  usernameField:'id',             // 👉login_c58.ejs
  passwordField:'pw',            // 👉login_c58.ejs
  session: true,                       // login 후 session을 저장할것인지?
  passReqToCallback:false,
  },
  function(입력한username, 입력한password, done) {
    db.collection('login').findOne({ id: 입력한username }, function (err, user결과) {

      console.log(colors.yellow('🦄c60 success'))            
      console.log(입력한username,입력한password)
      console.log(user결과)

      /*-40)
        error처리
        DB에 ID가 없을때
        DB에 ID가 있을때
        DB에 ID가 있으면, input password == DB password 비교함

        -50)
        done: 3개의 argument를 가짐
        done(서버에러, 성공시 사용자 db데이터, 에러 메시지)

        -60)        
        입력한 비밀번호를 암호화한 후 ,DB의 비밀번호와 비교해야함 (나중에 알아서 하세요)
      */

      if (err) { return done(err); }
      if (!user결과) { return done(null, false,{message:'존재하지않는 아이디입니다'}); }
      if (입력한password !== user결과.pw) { 
         return done(null, false,{message: '비번 틀림'});
      }
      return done(null, user결과,{message:'성공'});

    });
  }
));

// -70)
// login 성공 때, id를 이용해서 session을 저장 (session의 id정보를 cookie로 보냄)
// 👉f12 -> Application -> Cookies에서 확인
passport.serializeUser(function(user, done) {

  done(null, user.id);
});

// login 성공 때, 위의 session데이터를 가진사람을 db에서 찾아주세요
passport.deserializeUser(function(id, done) {

  User.findById(id, function (err, user) {
    done(err, user);
  });
});



















  // 🍀listen
  app.listen(process.env.PORT, function () {
      console.log(colors.green('hello'))
      console.log(`ig node server gogo, port: ${process.env.PORT}`.rainbow);
      
  });

  // cliend.close()있으면 post가 안됨..왜인지는 모름
  // client.close();
});





