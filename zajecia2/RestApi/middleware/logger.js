function logger(req,res,next){
    console.log("Request URL:", req.url)
    console.log("Method:",req.method)

    next()
}

module.exports = logger