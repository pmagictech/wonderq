# README
WonderQ is a broker that allows producers to write to it, and consumers to read from it. It runs on a single server and has a single message queue. Whenever a producer writes to WonderQ, a message ID is generated and returned as confirmation. Whenever a consumer polls WonderQ for new messages, it can get those messages. These messages will NOT be available for processing by any other consumer that may be concurrently accessing WonderQ.
## INSTALLATION
After cloning / copying the project directory, cd into the project directory and run
```
npm install
```
Then create a .env file and using the env file as your template.

To start the application run
```
npm start
```
For unit testing run
```
npm test
```
## API ENDPOINTS
### GET /new-message
Used by a consumer for fetching a new message.
#### Response
It returns a message object if a message is available. The return message will be made unavailable on subsequent request unless the timeout is reached (messages should be processed within 10 secs).
```
{
  error: 0,
  message: {
    id: "id of the message",
    body: "Content of the message"
  }
}
```
It returns with an error, if no message was found.
```
{
  error: 1
}
```
### POST /create-message
Used by a producer for creating a new message.
#### Request
The request body should be in this format.
```
{
  message: "The content of the message."
}
```
#### Response
It returns the generated id of the message if the message was successfully saved.
```
{
  error: 0,
  id: "id of the message"
}
```
It returns an error if the message was not saved.
```
{
  error: 1
}
```
### POST /update-message
Used by a consumer for updating the status of a message.
#### Request
The request body should be in this format.

```
{
  id: "The id of the message.",
  status: "The status of the message."
}
```
The allowed options for the status field are:
- 1  - It means that the message was processed so the message will be deleted.
-  2 - It means that the message was not processed (probably due to an error) so the message will be made available for fetching.
#### Response
It returns without an error if the message was successfully updated.
```
{
  error: 0
}
```
It returns an error if the message was not successfully updated.
```
{
  error: 1
}
```
The possible values for the return error are:
- 1 - The message not successfully updated.
- 2 - The message was not found (probably a wrong id was sent).
- 3 - Incorrect status was sent.