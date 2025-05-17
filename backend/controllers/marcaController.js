const Marca = require('../modelos/Marca');
const cloudinary = require('../config/cloudinary');

const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: `Vynce` },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

const registroMarca = async (req, res) => {
  try {
    const { nombreMarca, descripcion } = req.body;
    const { imgMarca, imgFragH, imgFragM } = req.files;

    if (!nombreMarca || !descripcion || !imgMarca || !imgFragH || !imgFragM) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const uploadedImgMarca = await uploadImage(imgMarca[0].buffer);
    const uploadedImgFragH = await uploadImage(imgFragH[0].buffer);
    const uploadedImgFragM = await uploadImage(imgFragM[0].buffer);

    const nuevaMarca = new Marca({
      nombreMarca,
      descripcion,
      imgMarca: uploadedImgMarca,
      imgFragH: uploadedImgFragH,
      imgFragM: uploadedImgFragM,
    });

    await nuevaMarca.save();
    res.status(201).json({ message: 'Marca registrada con éxito', marca: nuevaMarca });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const listaMarcas = async (req, res) => {
  try {
    const marcas = await Marca.find();
    res.status(200).json(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const nombreMarcas = async (req, res) => {
  try {
    const marcas = await Marca.find({}, { nombreMarca: 1, _id: 0 });
    res.status(200).json(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {  
    registroMarca,
    listaMarcas,
    nombreMarcas
};