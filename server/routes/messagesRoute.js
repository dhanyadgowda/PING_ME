const {addMessage, getAllMessage} = require('../Controlllers/messagesController')


const router=require('express').Router()

router.post('/addmsg',addMessage)
router.post('/getmsg', getAllMessage); 



module.exports = router