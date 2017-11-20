const redis = require('async-redis');
const client = redis.createClient({ port: process.env.REDIS_PORT || 6379 });


client.on('error', err => console.error(err));


const createRedisHelpers = (modelName, redis) => {
  const toKey = id => `${ modelName }:${ id }`;

  const nextIdKey = `nextIds:${ modelName }`;
  const nextIdGet = async () => {
    const exists = await redis.exists(nextIdKey);
    let id = 0;
    if (exists) {
      id = await redis.get(nextIdKey);
    }
    return ++id;
  };

  const nextIdSet = async () => {
    let id = await nextIdGet();
    await redis.set(nextIdKey, id);
    id = await redis.get(nextIdKey);
    return id;
  };

  const nextKeyGet = async () => {
    const id = await nextIdGet();
    return toKey(id);
  };

  return {
    key: modelName,
    toKey,
    next: {
      id: { get: nextIdGet, set: nextIdSet },
      key: { get: nextKeyGet }
    }
  };
};


const MessageTimestamp = require('./message_timestamp')(client);

const Message = require('./message')(
  client,
  createRedisHelpers('messages', client),
  MessageTimestamp
);

const Room = require('./room')(
  client,
  createRedisHelpers('rooms', client)
);




module.exports = {
  redis: client,
  MessageTimestamp,
  Message,
  Room
};
