var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/data2')
let { GenRoleID } = require('../utils/idHandler')

// GET all roles
router.get('/', function (req, res, next) {
  res.send(dataRole);
});

// GET role by id
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataRole.filter(
    function (e) {
      return e.id == id;
    }
  )
  if (result.length) {
    res.send(result[0])
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
});

// GET all users in a specific role
router.get('/:id/users', function (req, res, next) {
  let id = req.params.id;
  let result = dataRole.filter(
    function (e) {
      return e.id == id;
    }
  )
  if (result.length) {
    let usersInRole = dataUser.filter(
      function (e) {
        return e.role.id == id
      }
    )
    res.send(usersInRole)
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
});

// CREATE new role
router.post('/', function (req, res) {
  let newRole = {
    id: GenRoleID(dataRole),
    name: req.body.name,
    description: req.body.description,
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  }
  dataRole.push(newRole);
  res.send(newRole)
})

// UPDATE role
router.put('/:id', function (req, res) {
  let id = req.params.id;
  let result = dataRole.filter(
    function (e) {
      return e.id == id;
    }
  )
  if (result.length) {
    result = result[0];
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (result[key]) {
        result[key] = req.body[key]
      }
    }
    result.updatedAt = new Date(Date.now())
    res.send(result)
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
})

// DELETE role
router.delete('/:id', function (req, res) {
  let id = req.params.id;
  let result = dataRole.filter(
    function (e) {
      return e.id == id;
    }
  )
  if (result.length) {
    let index = dataRole.indexOf(result[0]);
    dataRole.splice(index, 1);
    res.send({
      message: "DELETE SUCCESS",
      deletedRole: result[0]
    })
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
})

module.exports = router;
