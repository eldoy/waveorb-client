const client = require('waveorb-client')

These should preferably be in the store so we don't get duplicates
Then components and pages can listen to the store variables

const db = client.db('http://localhost:4000')
const result = await db('projects/insert')({ name: 'test' })

const socket = client.socket('ws://localhost:4000')
const result = await ws('projects/insert')({ name: 'test' })

const upload = client.upload('http://localhost:4000')
const result = await upload('uploads/insert')

const sub = client.sub('ws://localhost:4000')
sub.on('data', function(data) {
  console.log(data)
})

Send these to the server and register with socket or app wide?
const result = await sub(['projects/insert', 'projects/update', 'tasks/insert'])

Only _id and path is sent back: { path: 'projects/insert', _id: '23452452345abcd' }
Then we can do db(model/get)({ _id }) and access will be applied according to the logged in user

Login / Signup
If there exists a user token it must be sent and validated for each request.
The server should find a user based on the token or error.
If error, the token should be removed.
Signup goes to users/insert with validations, returns user._id
Still have password and email in browser, use it to login after signup
Login goes to sessions/create, returns session token
Session token must be sent with each request
Server finds session, which has the user_id, and then finds the user based on that
Pass the user into the db function to make groups work
