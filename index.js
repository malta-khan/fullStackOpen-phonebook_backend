const express = require('express');
const morgan = require('morgan');

const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const Person = require('./models/person');

mongoose.set('strictQuery', false);
const url = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

morgan.token('jsonData', (request) => JSON.stringify(request.body));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :jsonData',
  ),
);

app.get('/api/persons', (request, response) => {
  Person.find().then((result) => {
    response.send(result);
  });
});

app.post('/api/persons', (request, response, next) => {
  const newPerson = new Person({ ...request.body });
  newPerson
    .save()
    .then((result) => {
      response.send(result);
    })
    .catch((err) => {
      next(err);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  Person.findById(id)
    .then((result) => {
      if (result) {
        response.send(result);
      } else {
        response.status(404).end('404 Invalid ID');
      }
    })
    .catch((err) => next(err));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  Person.findByIdAndUpdate(id, request.body, { new: true, runValidators: true })
    .then((result) => {
      if (result) {
        return response.send(result);
      }
      return response
        .status(400)
        .send({
          error:
            'contact does not exsist or already deleted. Refresh Page and try again',
        });
    })
    .catch((error) => {
      next(error);
    });
});
app.delete('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  Person.deleteOne({ _id: id }).then(() => response.status(204).end());
});

app.get('/info', (request, response) => {
  Person.find().then((result) => {
    const date = new Date();
    const html = `
        <div>Phonebook has info for ${result.length} people.</div>
        <div>${date}</div>`;
    response.send(html);
  });
});

function errorHandler(err, req, res, next) {
  if (err.name === 'CastError') {
    return res.status(400).send('Invalid ID format');
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  return next(err);
}
app.use(errorHandler);

mongoose.connect(url).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
  });
});
