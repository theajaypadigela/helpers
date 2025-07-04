import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/helpersdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  occupation: {
    type: String,
    required: true
  },
  organisationName: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  languages: {
    type: [String],
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  phone: {
    type: String,
    match: /^[0-9]{10}$/,
    required: true
  },
  email: {
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: false
  },
  vehicleType: {
    type: String,
    required: true
  }
});
const Helper = mongoose.model('Helper', userSchema, 'helpers');

app.get('/api/helpers', async (req, res) => {
    try {
        const helpers = await Helper.find();
        res.status(200).json(helpers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
