

module.exports = (redis, helpers, MessageTimestamp) => {


  const Message = { helpers };


  Message.create = async (body) => {
    const id = await helpers.next.id.get();
    const key = await helpers.next.key.get();

    const date = new Date();
    const createdAt = date.toISOString();
    const messageTimestamp = await MessageTimestamp.create(id);

    const options = { id, body, createdAt };

    await redis.hmset(key, options);
    const result = await redis.hgetall(key);
    await helpers.next.id.set();
    return result;
  };


  Message.all = async () => {
    const messageTimestamps = await MessageTimestamp.all();
    const key = helpers.key;
    const results = messageTimestamps.map(async mt => {
      return await redis.hgetall(`${ key }:${ mt.messageId }`);
    });
    return await Promise.all(results);
  };


  return Message;
};












