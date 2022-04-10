const jwt=requie('jsonwebtoken');

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        const decode=jwt.verify(token,process.env.JWT_KEY);
        req.userData=decode;
        next();
    }catch(err){
        returnres.status(401).json({
            messege:"Auth Failed!"
        });
    }
}
