var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/data2')
let { GenID, getItemById } = require('../utils/idHandler')

// GET all users
router.get('/', function (req, res, next) {
  res.send(dataUser);
});

// GET user by username
router.get('/:username', function (req, res, next) {
  let username = req.params.username;
  let result = dataUser.filter(
    function (e) {
      return e.username == username;
    }
  )
  if (result.length) {
    res.send(result[0])
  } else {
    res.status(404).send({
      message: "USERNAME NOT FOUND"
    })
  }
});

// CREATE new user
router.post('/', function (req, res) {
  let getRole = getItemById(req.body.roleId, dataRole);
  if (!getRole) {
    res.status(404).send({
      message: "ROLE ID NOT FOUND"
    })
    return
  }
  
  // Check if username already exists
  let existingUser = dataUser.filter(u => u.username == req.body.username);
  if (existingUser.length) {
    res.status(400).send({
      message: "USERNAME ALREADY EXISTS"
    })
    return
  }
  
  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
    status: req.body.status !== undefined ? req.body.status : true,
    loginCount: 0,
    role: getRole,
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  }
  dataUser.push(newUser);
  res.send(newUser)
})

// UPDATE user
router.put('/:username', function (req, res) {
  let username = req.params.username;
  let result = dataUser.filter(
    function (e) {
      return e.username == username;
    }
  )
  if (result.length) {
    result = result[0];
    
    // If updating role, verify role exists
    if (req.body.roleId) {
      let getRole = getItemById(req.body.roleId, dataRole);
      if (!getRole) {
        res.status(404).send({
          message: "ROLE ID NOT FOUND"
        })
        return
      }
      result.role = getRole;
    }
    
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (key !== 'roleId' && result[key] !== undefined) {
        result[key] = req.body[key]
      }
    }
    result.updatedAt = new Date(Date.now())
    res.send(result)
  } else {
    res.status(404).send({
      message: "USERNAME NOT FOUND"
    })
  }
})

// DELETE user
router.delete('/:username', function (req, res) {
  let username = req.params.username;
  let result = dataUser.filter(
    function (e) {
      return e.username == username;
    }
  )
  if (result.length) {
    let index = dataUser.indexOf(result[0]);
    dataUser.splice(index, 1);
    res.send({
      message: "DELETE SUCCESS",
      deletedUser: result[0]
    })
  } else {
    res.status(404).send({
      message: "USERNAME NOT FOUND"
    })
  }
})

module.exports = router;
