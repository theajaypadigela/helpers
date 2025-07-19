import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

mongoose.connect('mongodb://localhost:27017/helpersdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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
  },
  image: {
    type: String,
    required: false,
    default: null
  }
});
const Helper = mongoose.model('Helper', userSchema, 'helpers');

async function generateUniqueId() {
    const lastHelper = await Helper.findOne().sort({ id: -1 });
    return lastHelper ? lastHelper.id + 1 : 1;
}

function mapData(updatedData){
  const mappedData = {};
  mappedData.occupation = updatedData.TypeOfService;
  mappedData.organisationName = updatedData.Orgaization;
  mappedData.fullname = updatedData.Name;
  mappedData.languages = updatedData.Languages;
  mappedData.gender = updatedData.Gender;
  mappedData.phone = updatedData.Phone;
  mappedData.email = updatedData.Email;
  mappedData.vehicleType = updatedData.VehicleType;
  mappedData.image = updatedData.image || null;

  return mappedData;
}

 function getImageUrl(req) {
    return req.file
      ? `/uploads/${req.file.filename}`
      : null;
}

app.get('/api/helpers', async (req, res) => {
    try {
        const helpers = await Helper.find();
        res.status(200).json(helpers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/helpers/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        console.log('Updating helper with ID:', id, 'Data:', updatedData);
        
        const mappedData = mapData(updatedData);
        
        console.log('Mapped data:', mappedData);
        
        const helper = await Helper.findOneAndUpdate({ id: parseInt(id) }, mappedData, { new: true });

        if (!helper) {
            return res.status(404).json({ message: 'Helper not found' });
        }

        res.status(200).json({ message: 'Helper updated successfully', helper });
    } catch (error) {
        console.error('Error updating helper:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/helpers', upload.single('image'), async (req, res) => {
   try {
        console.log('Received helper data:', req.body);
        
        const helperData = { ...req.body };
        if (helperData._id) {
            delete helperData._id;
        }
        
        const incomingId = parseInt(helperData.id, 10);
        if (!incomingId) {
            helperData.id = await generateUniqueId();
        } else {
            helperData.id = incomingId;
        }
        
        const helper = new Helper(helperData);
        if(req.file) {  
            const imgUrl = getImageUrl(req);
            if (imgUrl) {
                helper.image = imgUrl;
            }
        }
        const savedHelper = await helper.save();
        console.log('Helper saved successfully---:', savedHelper);
        
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
    res.status(200).json({ message: 'Helper deleted successfully' });
  } catch (error) {
    console.error('Error deleting helper:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
