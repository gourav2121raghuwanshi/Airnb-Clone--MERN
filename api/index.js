const express = require('express')
const cookieParser = require('cookie-parser');
const dbConnect = require('./utils/databaseConnect')
const cors = require('cors');
const route = require('./routes/Routes');
require('dotenv').config();
// const path = require('path');
const imageDownloader = require('image-downloader');
const multer =require('multer')
const fs=require('fs');
// const Booking=require('./routes/Booking')

dbConnect();

const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));
const PORT=process.env.PORT||4000;
app.listen(PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
})

app.use('/api/user', route);
// app.use('/api/booking', Booking);

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';


  console.error("Error details:", err);

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.post('/api/upload-by-link', async (req, res) => {
  console.log("IN");

  try {
    const { link } = req.body;
    if (!link) {

      return res.status(400).json({ success: false, message: 'Link is required in the request body.' });
    }
    console.log(link);
    const newName = 'photo' + Date.now() + '.jpg';
    const options = {
      url: link,
      dest: __dirname + '/uploads/' + newName,
    };
    await imageDownloader.image(options);
    console.log("out");
    res.status(200).json(newName);
  } catch (error) {
    if (axios.isTimeoutError(error)) {
      console.error('Timeout error: The request took too long to complete.');
    } else {
      console.error('Other error occurred:', error.message);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
})

// const photosMiddleware=multer({dest:`${__dirname}'/uploads/`});
const photosMiddleware = multer({ dest: `${__dirname}/uploads/` });

app.post('/api/upload',photosMiddleware.array('photos',100),async(req,res)=>{
  const uploadedFiles=[];
  for(let i=0;i<req.files.length;++i){
  const {path,originalname}=req.files[i];
  const parts=originalname.split('.');
  const ext=parts[parts.length-1];

  console.log("paths are : ",path);
  const newPath=path+'.'+ext;
  fs.renameSync(path,newPath);

  console.log("new path is : ",newPath)
  const spl=newPath.split(`\\`);
  const ourans=spl[spl.length-1];
  console.log("our ans si " , ourans);
  uploadedFiles.push(ourans);
 }
  console.log(uploadedFiles);
  res.json(uploadedFiles);
})


app.get('/test', (req, res) => {
  res.json("ok")
})