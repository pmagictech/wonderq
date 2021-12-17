import dotenv from 'dotenv';
import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';

dotenv.config();

const HOST: string = process.env.HOST || 'localhost';
const PORT: number = parseInt(process.env.PORT as string) || 8000;
const MESSAGE_TIMEOUT: number = 10000;

export const app: Application = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


interface Message {
  id: string;
  body: string;
  isInUse: boolean;
  accessedAt: number;
}

const messageQueue: Message[] = [];

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello Welcome to WonderQ!');
})

app.get("/new-message", (req: Request, res: Response): void => {
  const foundIndex: number = messageQueue.findIndex(message => {
    return !message.isInUse || (Date.now() - message.accessedAt) > MESSAGE_TIMEOUT
  });

  if(foundIndex !== -1){
    const { id, body } = messageQueue[foundIndex];
    messageQueue[foundIndex].accessedAt = Date.now();
    messageQueue[foundIndex].isInUse = true;
    res.json({ error: 0, message: { id, body } });
  }
  else
    res.json({ error: 1 });
});


app.post("/create-message", (req: Request, res: Response): void => {
  try{
    if(req.body.message){
      let id: string = crypto.randomBytes(16).toString("hex");
      messageQueue.push({
        id,
        body: req.body.message,
        isInUse: false,
        accessedAt: 0,
      });
      res.json({ error: 0, id });
    }
    else
      res.json({ error: 1 });
  }
  catch(e){
    res.json({ error: 1 });
  }
});


app.post("/update-message", (req: Request, res: Response): void => {
  try{
    const foundIndex: number = messageQueue.findIndex(message => message.id == req.body.id);

    if(foundIndex === -1)
      res.json({ error: 2 });

    else if(req.body.status === 1){
      messageQueue.splice(foundIndex, 1);
      res.json({ error: 0 });
    }
    else if(req.body.status === 2){
      messageQueue[foundIndex].isInUse = false;
      res.json({ error: 0 });
    }
    else
      res.json({ error: 3 });
  }
  catch(e){
    res.json({ error: 1 });
  }
});


export const server = app.listen(PORT, HOST, (): void => {
  console.log(`Server Running here 👉 http://${HOST}:${PORT}`);
});