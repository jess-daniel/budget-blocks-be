exports.idAndBody = (req,res,next)=>{
    const body = req.body
    const id = req.params.userId
  
    if (!id || !body) {
      res.status(400).json({message:"please add a parameter at the end of the endpoint and a body to the request"});
    }else{
        next()
    }
}

exports.onlyId=(req,res,next)=>{
    const body = req.body
    const id = req.params.userId
  
    if (!id) {
      res.status(400).json({message:"please add a parameter at the end of the endpoint"});
    }else{
        next()
    }
}