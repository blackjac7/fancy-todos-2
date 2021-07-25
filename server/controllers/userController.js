const { User } = require('../models/index');
const { comparePass } = require('../helpers/bcrypt');
const generateToken = require('../helpers/jwt');
const {OAuth2Client} = require('google-auth-library');

class UserController {
  static register(req, res, next){
    const { name, email, password } = req.body;

    User.create({ name, email, password })
      .then(user => {
        let obj = {
          msg: "Register success",
          id: user.id,
          email: user.email,
          password: user.password
        };
        
        res.status(201).json(obj);
      })
      .catch(err => {
        next(err);
      })
  }

  static login(req, res, next){
    const { email, password } = req.body;

    User.findOne({
      where: {
        email
      }
    })
      .then(user => {
        if (!user) throw { name: "customError", msg: "Invalid email or password", status: 400 }
        const comparePassword = comparePass(password, user.password);
        if (!comparePassword) throw { name: "customError", msg: "Invalid email or password", status: 400 }
        const access_token = generateToken({
          id: user.id,
          email: user.email
        });

        res.status(200).json({ access_token });
      })
      .catch(err => {
        next(err);
      })
  }

  static googleLogin(req, res, next){
    const client = new OAuth2Client(process.env.CLIENT_ID);
    let name = "";
    let email = "";

    client.verifyIdToken({
      idToken: req.body.googleToken,
      audience: process.env.CLIENT_ID
    })
      .then(ticket => {
        const payload = ticket.getPayload();
        name = payload.name;
        email = payload.email;

        return User.findOne({ where: { email } });
      })
      .then(user => {
        if (user){
          //generate token
          const access_token = generateToken({
            id: user.id,
            email: user.email
          })
  
          res.status(200).json({ access_token })
        }else {
          return User.create({
            name,
            email,
            password: process.env.PASS_GOOGLE
          })
        }
      })
      .then(newUser => {
        const access_token = generateToken({
          id: newUser.id,
          email: newUser.email
        })

        res.status(201).json({ access_token })
      })
      .catch(err => {
        next(err)
      })
  }
}

module.exports = UserController;
