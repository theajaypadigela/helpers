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
    enum: ['male', 'female', 'other', 'Male', 'Female', 'Other'],
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

async function generateUniqueId() {
    const lastHelper = await Helper.findOne().sort({ id: -1 });
    return lastHelper ? lastHelper.id + 1 : 1;
}

app.get('/api/helpers', async (req, res) => {
    try {
        const helpers = await Helper.find();
        console.log('Fetched helpers:', helpers.length);
        res.status(200).json(helpers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/helpers', async (req, res) => {
   try {
        console.log('Received helper data:', req.body);
        
        const helperData = { ...req.body };
        if (helperData._id) {
            delete helperData._id;
        }
        
        if (!helperData.id || helperData.id === 0) {
            helperData.id = await generateUniqueId();
        }
        
        const helper = new Helper(helperData);
        const savedHelper = await helper.save();
        
        res.status(201).json({ 
            message: 'Helper added successfully', 
            helper: savedHelper 
        });
    } catch (error) {
        console.error('Error saving helper:', error);
        res.status(400).json({ message: error.message });
    }
});
app.delete('/api/helpers/:id',  async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Helper.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Helper not found' });
    }
  } catch (error) {
    console.error('Error deleting helper:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
