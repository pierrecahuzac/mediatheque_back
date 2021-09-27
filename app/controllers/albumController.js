const AlbumModel = require("../models/albumModel");
const UserModel = require('../models/userModel');


const albumController = {
  // récupérer tous les albums publics
  getAllAlbums: async (req, res) => {
    try {
      const albums = await AlbumModel.find();
      console.log(albums);
      res.json(albums);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "erreur de récupération des albums",
      });
    }
  },
  // récupérer les infos d'un album 
  getOneAlbum: async (req, res) => {
    try {
      const albumName = req.params.name;
      const album = await AlbumModel.findOne({
        name: albumName,
      });
      res.json(album);
    } catch (err) {
      console.trace(err);
      res.status(500).json({
        message: "erreur",
      });
    }
  },

  //récupérer un albbum avec son id
  getAlbumByID: async (req, res) => {
    const id = req.params.id.replace(':', "");    
    
    try {
      await AlbumModel.findById(id, (err, docs) => {
        console.log(docs);
        if (!err) {
          res.json(docs);
        } else {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  },

  // récupérer la liste des albums de l'utilisateur
  getAlbumsList: async (req, res) => {    
    const _id = req.params.id;
    try {
     const list =await AlbumModel.find({userId:{$eq:_id}});    
     console.log(list); 
        res.json(list);      
                     } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "erreur de récupération des albums",
      });
    }
  },
  /* getAlbumsList: async (req, res) => {    
    const _id = req.params.id;
    try {
     await AlbumModel.find( {userId: _id}, (err, docs) => {
       if(!err){
         console.log(docs);
         res.status(200).json({
           docs
         })
       }
       else{
         console.log(err);
    }
  });     
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "erreur de récupération des albums",
      });
    }
  }, */

  //ajouter un album public
  addAlbum: async (req, res) => {
    const { name, artist, cover, gencode, year, format, style } = req.body;
    try {
      const album = await AlbumModel.create({
        name,
        artist,
        cover,
        gencode,
        year,
        format,
        style,
        listAlbums:[]

      });
      res.status(200).json({
        album: album._id,
        name: album.name,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  
addAlbumToMyList: async (req, res)=>{   
  const { name, artist, cover, gencode, year, format, style } = req.body;
  const _id = req.params.id;
console.log(_id);
 
  try {
     const album = await AlbumModel.create({
     userId:_id,
      name,
      artist,
      cover,
      gencode,
      year,
      format,
      style, 
     });
    
      res.status(200).json({
        album
      });     
  }
catch (error) {
    return res.status(500).json(error);
  }
},
  
  deleteAlbum: async (req, res) => {
    const id = req.params.id.replace(':',"");    
    try {
      await AlbumModel.findOneAndRemove(
        {
          _id: id,
        },
        (err, docs) => {                 
          if (!err) {
            console.log('ici', docs);
            delete docs
            res.status(200).json({ message: "Successfully deleted." });
          }
          else if(err){
            console.log(err);
            res.json({err});
          }  
          else{
            res.json({
              message: "album introuva ble"
            })
          }
        }
      );

      
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  },  

}

module.exports = albumController;

// collection user
// const { albumPossédé } = await tacollection.getOne({ _id: iduser })
// getOneAlbum(id)
// {
//  id: 'sonid'
//  name: 'toto',
//  albumPossédé : [
//    'idalbum1', 'idalbum2'
//  ]
// }
