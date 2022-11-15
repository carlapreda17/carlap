module.exports=func=>{
    return (req,res,next)=>{ //returneaza o functie care executa func si se duce la catch
        func(req,res,next).catch(next) //daca e eroare se duce la app.use
    }
}