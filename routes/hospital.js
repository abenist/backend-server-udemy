var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var mdAutenticacion = require('../middlewares/autenticacion');


// =========================================
// Obtener todos los hospitales
// =========================================
app.get('/', (req, res, next) => {
    
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({ })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
        (err, hospitales) => {
            if(err){
                return  res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar hospital',
                    errror: err
                });
            }
        
            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    hospitales: hospitales
                });
            });
 
    });   
});


// =========================================
// Actualizar un hospitales
// =========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) =>{
        if(err){
            return  res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errror: err
            });
        }

        if(!hospital){
            return  res.status(400).json({
                ok: false,
                mensaje: `El hospital con id ${id} no existe `,
                errror: { message: 'No existe un hospital con ese ID '}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( (err, hospitalGuardado) => {

            if(err){
                return  res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errror: err
                });
            }
            
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    
        
    });
});


// =========================================
// Crear un hospital
// =========================================
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save( (err, hospitalGuardado) => {
        if(err){
            return  res.status(400).json({
                ok: false,
                mensaje: 'Error al crear ususario',
                error: err
            });
        }
    
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
        
});



// =========================================
// Borrar un hospital por el id
// =========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if(err){
            return  res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errror: err
            });
        }
    
        if(!hospitalBorrado){
            return  res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id.',
                errror: {message: 'No existe un hospital con ese id.'}
            });
        }
    
        res.status(200).json({
            ok: true,
            usuario: hospitalBorrado
        });

    });
});

module.exports = app;
