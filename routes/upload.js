var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


var app = express();

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    
    if(tiposValidos.indexOf(tipo) < 0){
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            error: {message: 'Tipo de colección no es válida'} 
        });   
    }

    if(!req.files){
        res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            error: {message: 'Debe de seleccionar una imagen'} 
        });   
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[ nombreCortado.length - 1]

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'png'];

    if(extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no valida',
            error: {message: 'Las extensiones validas son' + extensionesValidas.join(', ')} 
        });   
    }

    // Npmbre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    // console.log(nombreArchivo)

    // Mover el archivo del temporal a un path 
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    // console.log(path)

    archivo.mv(path, err => {

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                error: err
            });   
        }

        subirPorTipo( tipo, id, nombreArchivo, res);

    });

});


function subirPorTipo( tipo, id, nombreArchivo, res){

    if(tipo === 'usuarios'){
        Usuario.findById(id, (err, usuario) => {
            
            if(!usuario){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    error: {message: 'El usuario no existe'}
                });
            }

            var pathViejo = './uploads/usuarios' + usuario.img;

            // Si existe, elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo, err => {
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al eliminar la imagen  del usuario anterior',
                            error: err
                        }); 
                    }
                });
            }

            usuario.img = nombreArchivo;
            usuario.save( (err, usuarioActualizado) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al guardar el usuario',
                        error: err
                    });   
                }

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de usuario actualizada',
                usuario: usuarioActualizado
                });
            });
        });
    }

    if(tipo === 'medicos'){
        Medico.findById(id, (err, medico) => {

            if(!medico){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El médico no existe',
                    error: {message: 'El médico no existe'}
                });   
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe, elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                console.log(pathViejo)
                fs.unlink(pathViejo, err => {
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error eliminar la imagen del médico anterior',
                            error: err
                        }); 
                    }
                });
            }

            medico.img = nombreArchivo;
            medico.save( (err, medicoActualizado) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al guardar médico',
                        error: err
                    });   
                }


                return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de medico actualizada',
                medico: medicoActualizado
                });
            });
        });
    }

    if(tipo === 'hospitales'){
        Hospital.findById(id, (err, hospital) => {

            if(!hospital){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital no existe',
                    error: {message: 'El hospital no existe'}
                });   
            }

            var pathViejo = './uploads/hospitales' + hospital.img;

            // Si existe, elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo, err => {
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error eliminar la imagen del hospital anterior',
                            error: err
                        }); 
                    }
                });
            }

            hospital.img = nombreArchivo;
            hospital.save( (err, hospitalActualizado) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al guardar hospital',
                        error: err
                    });   
                }

                return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de hospital actualizada',
                hospital: hospitalActualizado
                });
            });
        });
    }

}

module.exports = app;




// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));
 