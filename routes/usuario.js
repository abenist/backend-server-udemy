var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();

var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');


// =========================================
// Obtener todos los ususarios
// =========================================
app.get('/', (req, res, next) => {

    Usuario.find({ }, 'nombre email img role')
        .exec(
        (err, usuarios) => {
            if(err){
                return  res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar ususario',
                    errror: err
                });
            }
        
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
    });   
});


// =========================================
// Actualizar un usuario
// =========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) =>{
        if(err){
            return  res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ususario',
                errror: err
            });
        }

        if(!usuario){
            return  res.status(400).json({
                ok: false,
                mensaje: `El usuario con id ${id} no existe `,
                errror: { message: 'No existe un usuario con ese ID '}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado) => {

            if(err){
                return  res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar ususario',
                    errror: err
                });
            }

            usuarioGuardado.password = ':)';
            
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    
        
    });
});


// =========================================
// Crear un usuario
// =========================================
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado) => {
        if(err){
            return  res.status(400).json({
                ok: false,
                mensaje: 'Error al crear ususario',
                errror: err
            });
        }
    
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
        
});



// =========================================
// Borrar un usuario por el id
// =========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if(err){
            return  res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar ususario',
                errror: err
            });
        }
    
        if(!usuarioBorrado){
            return  res.status(400).json({
                ok: false,
                mensaje: 'No existe un ususario con ese id.',
                errror: {message: 'No existe un ususario con ese id.'}
            });
        }
    
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;
