import { Router } from 'express';
import userModel from '../models/user.js';
import { createHash }from '../services/hash.js'
import uploader from '../services/upload.js';
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../configs/config.js';

const router = Router();

router.post('/register',uploader.single('avatar'),async(req,res)=>{
    try {
        const file = req.file;
        if(!file) return res.status(500).send({status:'error',error:'error al cargar el archivo'})
        const {first_name,last_name,email,password} = req.body;
        if(!first_name||!last_name||!email||!password) return res.status(400).send({status:'error',error:'faltan valores'});
        const exist = await userModel.findOne({email});
        if(exist) return res.status(400).send({status:'error',error:'el usuario ya existe'});
        const hashedPassword = await createHash(password);
        let user = {
            first_name,
            last_name,
            email,
            password:hashedPassword,
            avatar:`${req.protocol}://${req.hostname}:${process.env.PORT}/img/${file.filename}`
        };
        const result = await userModel.create(user);
        res.send({status:'success', message:'registrado'});
    } catch (error) {
        res.status(500).send({status:'error',error:'error del servidor'})
    }
});

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/loginFail',session:false}),async(req,res)=>{
    try{
        const userToken = {
            name:`${req.user.first_name} ${req.user.last_name}`,
            role:req.user.role,
            id:req.user._id,
            avatar:req.user.avatar
        }
        const token = jwt.sign(userToken,config.jwt.SECRET,{expiresIn:"1d"});
        res.cookie(config.jwt.COOKIE,token).send({status:"success",message:"logged in"})
    }catch(error){
        res.status(500).send({status:"error",error:"Error del servidor"})
    }
});

router.get('/loginFail',(req,res)=>{
    res.render('error al loguear')
})

router.get('/github',passport.authenticate('github',{scope:[]}),(req,res)=>{
    //este punto solo se encarga de ABRIR LA APLICACION EN EL NAVEGADOR
})

router.get('/githubCallback',passport.authenticate('github'),(req,res)=>{

    const userToken = {
        name:`${req.user.name}`,
        role:'user',
        id:req.user._id
    }

    const token = jwt.sign(userToken,config.jwt.SECRET,{expiresIn:"1d"});
    res.cookie(config.jwt.COOKIE,token).send({status:"success",message:"logged in"});
})

export default router