# project_superchat
Build a realtime multi-room chat application. Make it super.


## Models

Messages

- id
- body
- userId
- roomId
- createdAt


MessageTimestamps

- time (as integer)
- messageId


Users

- id
- username


Rooms

- id
- name


## Routes

- GET `/login`
- GET/DELETE `/logout`
- GET `/rooms`
- GET `/rooms/:id`


## Views

- Users create
    - Creating a user will automatically login that user
    - This will create a session
    - Must be able to logout/destroy user/session
- Rooms index
- Rooms show


## Socket Logistics

Messages

- All clients must be in sync when messages are sent
- An event should be emitted when a message is created
- The event should update the messages in the appropriate room for all clients
- Messages will be ordered by timestamp
- The data structure can be an object where keys are the timestamp
- It is possible for multiple messages to be sent at the same time
- The values will be arrays so as to hold multiple messages for the same timestamp
- When the page is loaded for the first time, all messages for that room (going back a certain amount of time) are loaded
- When new messages are sent, only those messages are sent via sockets
- When the room displays over 1000 messages, older messages should be discarded


Users

- When a user joins a room, the user should be added to that room's list of members
- When a user leaves a room, the user should be removed from that room's list of members


Rooms

- When a room is created, it should be added to the list of available rooms
- When a room is deleted, it should be removed from the list of available rooms






