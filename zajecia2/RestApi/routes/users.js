const express = require('express')
const router = express.Router()

const users = require('../data/users')

const logger = require('../middleware/logger')


router.get('/',logger,(req,res)=>{
    res.json(users)
})

router.get('/:id',logger,(req,res)=>{
    const id = parseInt(req.params.id)
    const user = users.find(u=>u.id === id)

    if(!user) return res.status(404).json({message:"user not found"})

    res.json(user)
})

router.post('/',logger,(req,res)=>{
    const {name,age} = req.body
    const newUser = {id:users.length+1,name,age}
    users.push(newUser)
    res.status(201).json(newUser)
})

router.patch('/:id',logger,(req,res)=>{
    const id = parseInt(req.params.id)
    const user = users.find(u=>u.id === id)
    if(!user) return res.status(404).json({message:"user not found"})
    
    const {name,age} = req.body
    if(name) user.name = name
    if(age) user.age=age
    res.json(user)
})

router.delete('/:id',logger,(req,res)=>{
    const id = parseInt(req.params.id)
    const index = users.findIndex(u=>u.id === id)
    if(index===-1) return res.status(404).json({message:"user not found"})
    
    users.splice(index,1)
    res.json({message:"User deleted"})
})

module.exports=router