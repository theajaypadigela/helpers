import express, { Request, Response } from 'express';
import mongoose, { Model, Schema } from 'mongoose';
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
} as any);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.originalname);
  }
});

interface IHelper {
  id: number;
  occupation: string;
  organisationName: string;
  fullname: string;
  languages: string[];
  gender: 'male' | 'female' | 'other' | 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  vehicleType: string;
  image?: string | null;
  pdf?: string | null;
  additionalDocument?: string | null;
  JoinedOn?: Date;
}

const userSchema = new Schema<IHelper>({
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
  },
  pdf: {
    type: String,
    required: false,
    default: null
  },
  additionalDocument: {
    type: String,
    required: false,
    default: null
  },
  JoinedOn: {
    type: Date,
    required: false,
    default: Date.now
  }
});

const Helper: Model<IHelper> = mongoose.model<IHelper>('Helper', userSchema, 'helpers');

async function generateUniqueId(): Promise<number> {
  const lastHelper = await Helper.findOne().sort({ id: -1 });
  return lastHelper ? lastHelper.id + 1 : 1;
}

function mapData(updatedData: Record<string, any>): Partial<IHelper> {
  const mappedData: Partial<IHelper> = {};
  mappedData.occupation = updatedData.TypeOfService;
  mappedData.organisationName = updatedData.Orgaization;
  mappedData.fullname = updatedData.Name;
  if (Array.isArray(updatedData.Languages)) {
    mappedData.languages = updatedData.Languages;
  } else if (updatedData.Languages) {
    mappedData.languages = [updatedData.Languages];
  } else {
    mappedData.languages = [];
  }
  mappedData.gender = updatedData.Gender as IHelper['gender'];
  mappedData.phone = updatedData.Phone;
  mappedData.email = updatedData.Email;
  mappedData.vehicleType = updatedData.VehicleType;
  mappedData.image = updatedData.image || null;
  mappedData.pdf = updatedData.pdf || null;
  mappedData.additionalDocument = updatedData.additionalDocument || null;
  mappedData.JoinedOn = updatedData.JoinedOn || new Date();

  return mappedData;
}

function getFileUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null;
  const filename = path.basename(filePath);
  return `/uploads/${filename}`;
}

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'additionalDocument') {
      cb(null, true);
      return;
    }
    const isImage = file.mimetype.startsWith('image/');
    const isPdf = file.mimetype === 'application/pdf';
    if (isImage || isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  }
});

const cpUpload = upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'additionalDocument', maxCount: 1 },
]);

app.get('/api/helpers', async (req: Request, res: Response) => {
  try {
    const helpers = await Helper.find();
    // Convert file paths to URLs for frontend consumption
    const helpersWithUrls = helpers.map(helper => ({
      ...helper.toObject(),
      image: getFileUrl(helper.image),
      pdf: getFileUrl(helper.pdf),
      additionalDocument: getFileUrl(helper.additionalDocument)
    }));
    res.status(200).json(helpersWithUrls);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/helpers/:id', cpUpload, async (req: Request, res: Response) => {
  const { id } = req.params;
  let updatedData = req.body;

  try {
    console.log('Updating helper with ID:', id, 'Data:', updatedData);

    if (typeof updatedData.data === 'string') {
      updatedData = JSON.parse(updatedData.data);
    }

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.image && files.image[0]) {
        updatedData.image = path.join(process.cwd(), 'uploads', files.image[0].filename);
      }
      if (files.pdf && files.pdf[0]) {
        updatedData.pdf = path.join(process.cwd(), 'uploads', files.pdf[0].filename);
      }
      if (files.additionalDocument && files.additionalDocument[0]) {
        updatedData.additionalDocument = path.join(process.cwd(), 'uploads', files.additionalDocument[0].filename);
      }
    }

    const mappedData = mapData(updatedData);

    console.log('Mapped data:', mappedData);

    const helper = await Helper.findOneAndUpdate({ id: parseInt(id) }, mappedData, { new: true });

    if (!helper) {
      return res.status(404).json({ message: 'Helper not found' });
    }

    const helperWithUrls = {
      ...helper.toObject(),
      image: getFileUrl(helper.image),
      pdf: getFileUrl(helper.pdf),
      additionalDocument: getFileUrl(helper.additionalDocument)
    };

    res.status(200).json({ message: 'Helper updated successfully', helper: helperWithUrls });
  } catch (error: any) {
    console.error('Error updating helper:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.post(
  '/api/helpers',
  cpUpload,
  async (req: Request, res: Response) => {
    try {
      console.log('=== POST /api/helpers called ===');
      console.log('Received helper data:', req.body);
      console.log('Received files:', req.files);

      let helperData: Record<string, any> = { ...req.body };
      delete helperData._id;

      if (req.files) {
        console.log('Processing file uploads...');
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files.image && files.image[0]) {
          helperData.image = path.join(process.cwd(), 'uploads', files.image[0].filename);
          console.log('Image file processed:', helperData.image);
        }
        if (files.pdf && files.pdf[0]) {
          helperData.pdf = path.join(process.cwd(), 'uploads', files.pdf[0].filename);
          console.log('PDF file processed:', helperData.pdf);
        }
        if (files.additionalDocument && files.additionalDocument[0]) {
          helperData.additionalDocument = path.join(process.cwd(), 'uploads', files.additionalDocument[0].filename);
          console.log('Additional document processed:', helperData.additionalDocument);
        }
      }

      if (helperData.TypeOfService || helperData.Orgaization || helperData.Name) {
        console.log('Data needs mapping - using mapData function');
        helperData = mapData(helperData);
      } else {
        console.log('Data is already in database format');
      }

      console.log('Final helper data before saving:', helperData);

      const incomingId = parseInt(helperData.id, 10);
      helperData.id = incomingId || (await generateUniqueId());

      console.log('Creating Helper with data:', helperData);
      const helper = new Helper(helperData);
      const savedHelper = await helper.save();

      const helperWithUrls = {
        ...savedHelper.toObject(),
        image: getFileUrl(savedHelper.image),
        pdf: getFileUrl(savedHelper.pdf),
        additionalDocument: getFileUrl(savedHelper.additionalDocument)
      };

      console.log('Helper saved successfully:', savedHelper);
      res.status(201).json({
        message: 'Helper added successfully',
        helper: helperWithUrls
      });
    } catch (error: any) {
      console.error('=== ERROR in POST /api/helpers ===');
      console.error('Error saving helper:', error);
      console.error('Error stack:', error.stack);
      res.status(400).json({ message: error.message });
    }
  }
);

app.delete('/api/helpers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Helper.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Helper not found' });
    }
    res.status(200).json({ message: 'Helper deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting helper:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
