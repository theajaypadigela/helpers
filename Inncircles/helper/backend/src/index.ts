import express, { Request, Response } from 'express';
import mongoose, { Model, Schema } from 'mongoose';
import { S3Client, PutObjectCommand, GetObjectCommand  } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

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

async function getS3SignedUrl(key: string | null | undefined): Promise<string | null> {
  if (!key) return null;
  if (key.startsWith('http')) return key;
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });
    const signedUrl = await getSignedUrl(s3Client, command);
    return signedUrl;
  } catch (error) {
    console.error(`Error generating signed URL for key ${key}:`, error);
    return null;
  }
}

async function generateUniqueId(): Promise<number> {
  const lastHelper = await Helper.findOne().sort({ id: -1 });
  return lastHelper ? lastHelper.id + 1 : 1;
}

function mapData(updatedData: Record<string, any>): Partial<IHelper> {
  const mappedData: Partial<IHelper> = {};
  mappedData.occupation = updatedData.occupation;
  mappedData.organisationName = updatedData.organisationName;
  mappedData.fullname = updatedData.fullname;
  if (Array.isArray(updatedData.languages)) {
    // Handle nested arrays like [['telugu', 'english']]
    if (updatedData.languages.length > 0 && Array.isArray(updatedData.languages[0])) {
      mappedData.languages = updatedData.languages[0];
    } else {
      mappedData.languages = updatedData.languages;
    }
  } else if (updatedData.languages) {
    mappedData.languages = [updatedData.languages];
  } else {
    mappedData.languages = [];
  }
  mappedData.gender = updatedData.gender as IHelper['gender'];
  mappedData.phone = updatedData.phone;
  mappedData.email = updatedData.email;
  mappedData.vehicleType = updatedData.vehicleType;
  
  // Handle image field - ensure it's a string or null, not an object
  if (updatedData.image && typeof updatedData.image === 'string') {
    mappedData.image = updatedData.image;
  } else {
    mappedData.image = null;
  }
  
  // Handle pdf field - ensure it's a string or null
  if (updatedData.pdf && typeof updatedData.pdf === 'string') {
    mappedData.pdf = updatedData.pdf;
  } else {
    mappedData.pdf = null;
  }
  
  // Handle additionalDocument field - ensure it's a string or null
  if (updatedData.additionalDocument && typeof updatedData.additionalDocument === 'string') {
    mappedData.additionalDocument = updatedData.additionalDocument;
  } else {
    mappedData.additionalDocument = null;
  }
  
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

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

async function addImage(image: string): Promise<any> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `helpers/${Date.now()}.jpg`,
    Body: image
  });
  const signedUrl = await getSignedUrl(s3Client, command);
  return signedUrl;
}

app.get('/api/helpers/getUrl', async (req: Request, res: Response) => {
  try {
    const key = `helpers/${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: 'image/jpeg',
    });

    const signedUrl = await getSignedUrl(s3Client, command); 

    res.status(200).json({ url: signedUrl, key });
  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ message: 'Failed to generate signed URL', error: error.message });
  }
});

app.get('/api/helpers/getImageUrl', async (req: Request, res: Response) => {
  const { key } = req.query;
  if (!key || typeof key !== 'string') {
    return res.status(400).json({ message: 'Invalid key parameter' });
  }

  try {
    const signedUrl = await getS3SignedUrl(key);
    if (!signedUrl) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(200).json({ imageUrl: signedUrl });
  } catch (error: any) {
    console.error('Error getting image URL:', error);
    res.status(500).json({ message: 'Failed to get image URL', error: error.message });
  }
});

app.get('/api/helpers', async (req: Request, res: Response) => {
  try {
    const helpers = await Helper.find();
    const helpersWithUrls = await Promise.all(
      helpers.map(async (helper) => {
        const helperObj = helper.toObject();
        return {
          ...helperObj,
          image: await getS3SignedUrl(helper.image),
          pdf: getFileUrl(helper.pdf),
          additionalDocument: getFileUrl(helper.additionalDocument),
        };
      })
    );
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
      image: await getS3SignedUrl(helper.image),
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
  async (req: Request, res: Response) => {
    try {
      console.log('Received request to add new helper:', req.body);
      let helperData = req.body;

      // If data is nested under a 'data' property, extract it
      if (helperData.data) {
        if (typeof helperData.data === 'string') {
          helperData = JSON.parse(helperData.data);
        } else {
          helperData = helperData.data;
        }
      }

      const mappedData = mapData(helperData);

      console.log('Mapped data for new helper:', mappedData);

      const uniqueId = await generateUniqueId();
      mappedData.id = uniqueId;

      const newHelper = new Helper(mappedData);
      await newHelper.save();

      res.status(201).json({ message: 'Helper added successfully', helper: newHelper });
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
