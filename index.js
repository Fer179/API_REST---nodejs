import { log } from 'console';
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync('./BD.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing the file:', error);
    }
}

const writeData = (data) => {
    try {
        fs.writeFileSync('./BD.json', JSON.stringify(data));
    } catch (error) {
        console.error('Error writing the file:', error);
    }
}

app.get('/', (req, res) => {
    res.send('Prueba de api con nodejs');
});

app.get('/peliculas', (req, res) => {
    const data = readData();
    res.json(data.peliculas);
});

app.get('/peliculas/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const pelicula = data.peliculas.find(pelicula => pelicula.id == id);
    res.json(pelicula);
});

app.post('/peliculas', (req, res) => {
    const data = readData();
    const pelicula = req.body;

    const nuevaPelicula = {
        id: data.peliculas.length + 1,
        ...pelicula
    };
    data.peliculas.push(nuevaPelicula);
    writeData(data);
    res.json(nuevaPelicula);
});

app.put('/peliculas/:id', (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const PeliculaIndex = data.peliculas.findIndex(pelicula => pelicula.id == id);

    data.peliculas[PeliculaIndex] = {
        ...data.peliculas[PeliculaIndex],
        ...body,
    };
    writeData(data);
    res.json({message : 'Pelicula actualizada'});
});

app.delete('/peliculas/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const peliculaIndex = data.peliculas.findIndex(pelicula => pelicula.id == id);

    data.peliculas.splice(peliculaIndex, 1);
    writeData(data);
    res.json({message : 'Pelicula eliminada'});
});

app.listen(3000, () => {  
    console.log('Server is running on port 3000'); 
});