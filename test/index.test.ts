import { app, server } from '../src/index';
import supertest from 'supertest';


const requestWithSupertest = supertest(app);


describe('Testing API Endpoints', (): void => {

  it('First GET /new-message should have an error', async (): Promise<void> => {
    const res = await requestWithSupertest.get('/new-message');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toEqual(1);
  });

  it('First POST /create-message with no message should have an error', async (): Promise<void> => {
    const res = await requestWithSupertest.post('/create-message').send();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('error');
  });

  it('Second GET /new-message should have an error', async (): Promise<void> => {
    const res = await requestWithSupertest.get('/new-message');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toEqual(1);
  });


  it('Second POST /create-message with message should have no error', async (): Promise<void> => {
    const res = await requestWithSupertest.post('/create-message').send({message:'dd'});
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toEqual(0);
    expect(res.body).toHaveProperty('id');
  });

  it('Third GET /new-message should have no error', async (): Promise<void> => {
    const res = await requestWithSupertest.get('/new-message');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toEqual(0);
  });

  it('Fourth GET /new-message should have an error because message is in use', async (): Promise<void> => {
    const res = await requestWithSupertest.get('/new-message');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toEqual(1);
  });

  it('GET /new-message after 10 sec should have no error because message has timeout', async (): Promise<void> => {
      await new Promise((r) => setTimeout(r, 10000));

      const res = await requestWithSupertest.get('/new-message');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual(0);
  });


  it('Testing POST /update-message with status 1', async (): Promise<void> => {
    const message = 'Testing';

    const res1 = await requestWithSupertest.post('/create-message').send({ message });
    expect(res1.status).toEqual(200);
    expect(res1.type).toEqual(expect.stringContaining('json'));
    expect(res1.body).toHaveProperty('error');
    expect(res1.body.error).toEqual(0);
    expect(res1.body).toHaveProperty('id');

    const res2 = await requestWithSupertest.get('/new-message');
    expect(res2.status).toEqual(200);
    expect(res2.type).toEqual(expect.stringContaining('json'));
    expect(res2.body).toHaveProperty('error');
    expect(res2.body.error).toEqual(0);
    expect(res2.body).toHaveProperty('message');
    expect(res2.body.message).toHaveProperty('body');
    expect(res2.body.message.body).toEqual(message);
    expect(res2.body.message).toHaveProperty('id');
    expect(res2.body.message.id).toEqual(res1.body.id);

    const res3 = await requestWithSupertest.get('/new-message');
    expect(res3.status).toEqual(200);
    expect(res3.type).toEqual(expect.stringContaining('json'));
    expect(res3.body).toHaveProperty('error');
    expect(res3.body.error).toEqual(1);

    const res4 = await requestWithSupertest.post('/update-message').send({id:res2.body.message.id, status: 1});
    expect(res4.status).toEqual(200);
    expect(res4.type).toEqual(expect.stringContaining('json'));
    expect(res4.body).toHaveProperty('error');
    expect(res4.body.error).toEqual(0);

    const res5 = await requestWithSupertest.get('/new-message');
    expect(res5.status).toEqual(200);
    expect(res5.type).toEqual(expect.stringContaining('json'));
    expect(res5.body).toHaveProperty('error');
    expect(res5.body.error).toEqual(1);
  });

  it('Testing POST /update-message with status 2', async (): Promise<void> => {
    const message = 'Testing2';

    const res1 = await requestWithSupertest.post('/create-message').send({ message });
    expect(res1.status).toEqual(200);
    expect(res1.type).toEqual(expect.stringContaining('json'));
    expect(res1.body).toHaveProperty('error');
    expect(res1.body.error).toEqual(0);
    expect(res1.body).toHaveProperty('id');

    const res2 = await requestWithSupertest.get('/new-message');
    expect(res2.status).toEqual(200);
    expect(res2.type).toEqual(expect.stringContaining('json'));
    expect(res2.body).toHaveProperty('error');
    expect(res2.body.error).toEqual(0);
    expect(res2.body).toHaveProperty('message');
    expect(res2.body.message).toHaveProperty('body');
    expect(res2.body.message.body).toEqual(message);

    const res3 = await requestWithSupertest.get('/new-message');
    expect(res3.status).toEqual(200);
    expect(res3.type).toEqual(expect.stringContaining('json'));
    expect(res3.body).toHaveProperty('error');
    expect(res3.body.error).toEqual(1);

    const res4 = await requestWithSupertest.post('/update-message').send({id:res1.body.id, status: 2});
    expect(res4.status).toEqual(200);
    expect(res4.type).toEqual(expect.stringContaining('json'));
    expect(res4.body).toHaveProperty('error');
    expect(res4.body.error).toEqual(0);

    const res5 = await requestWithSupertest.get('/new-message');
    expect(res5.status).toEqual(200);
    expect(res5.type).toEqual(expect.stringContaining('json'));
    expect(res5.body).toHaveProperty('error');
    expect(res5.body.error).toEqual(0);
    expect(res5.body).toHaveProperty('message');
    expect(res5.body.message).toHaveProperty('body');
    expect(res5.body.message.body).toEqual(message);
  });

  it('Testing POST /update-message with incorrect id should return error 2', async (): Promise<void> => {
    const message = 'Testing2';

    const res1 = await requestWithSupertest.post('/create-message').send({ message });
    expect(res1.status).toEqual(200);
    expect(res1.type).toEqual(expect.stringContaining('json'));
    expect(res1.body).toHaveProperty('error');
    expect(res1.body.error).toEqual(0);
    expect(res1.body).toHaveProperty('id');

    const res2 = await requestWithSupertest.get('/new-message');
    expect(res2.status).toEqual(200);
    expect(res2.type).toEqual(expect.stringContaining('json'));
    expect(res2.body).toHaveProperty('error');
    expect(res2.body.error).toEqual(0);
    expect(res2.body).toHaveProperty('message');
    expect(res2.body.message).toHaveProperty('body');
    expect(res2.body.message.body).toEqual(message);

    const res4 = await requestWithSupertest.post('/update-message').send({id: 'ddsds', status: 1});
    expect(res4.status).toEqual(200);
    expect(res4.type).toEqual(expect.stringContaining('json'));
    expect(res4.body).toHaveProperty('error');
    expect(res4.body.error).toEqual(2);
  });

  it('Testing POST /update-message with incorrect status should return error 3', async (): Promise<void> => {
    const message = 'Testing2';

    const res1 = await requestWithSupertest.post('/create-message').send({ message });
    expect(res1.status).toEqual(200);
    expect(res1.type).toEqual(expect.stringContaining('json'));
    expect(res1.body).toHaveProperty('error');
    expect(res1.body.error).toEqual(0);
    expect(res1.body).toHaveProperty('id');

    const res2 = await requestWithSupertest.get('/new-message');
    expect(res2.status).toEqual(200);
    expect(res2.type).toEqual(expect.stringContaining('json'));
    expect(res2.body).toHaveProperty('error');
    expect(res2.body.error).toEqual(0);
    expect(res2.body).toHaveProperty('message');
    expect(res2.body.message).toHaveProperty('body');
    expect(res2.body.message.body).toEqual(message);

    const res4 = await requestWithSupertest.post('/update-message').send({id:res1.body.id, status: 3});
    expect(res4.status).toEqual(200);
    expect(res4.type).toEqual(expect.stringContaining('json'));
    expect(res4.body).toHaveProperty('error');
    expect(res4.body.error).toEqual(3);
  });
});

server.close();