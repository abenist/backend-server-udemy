var express = require('express');

var app = express();

var Medico = require('../models/medico');
var mdAutenticacion = require('../middlewares/autenticacion');


// =========================================
// Obtener todos los medicos
// =========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({ })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
        (err, medicos) => {
            if(err){
                return  res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar medico',
                    errror: err
                });
            }
        
            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    medicos: medicos
                });
            });
    });   
});


// =========================================
// Actualizar un medico
// =========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) =>{
        if(err){
            return  res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errror: err
            });
        }

        if(!medico){
            return  res.status(400).json({
                ok: false,
                mensaje: `El medico con id ${id} no existe `,
                errror: { message: 'No existe un medico con ese ID '}
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        medico.save( (err, medicoGuardado) => {

            if(err){
                return  res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errror: err
                });
            }
            
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    
        
    });
});


// =========================================
// Crear un medico
// =========================================
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital 
    });

    medico.save( (err, medicoGuardado) => {
        if(err){
            return  res.status(400).json({
                ok: false,
                mensaje: 'Error al crear ususario',
                error: err
            });
        }
    
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
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
