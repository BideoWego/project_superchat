

module.exports = (redis, helpers, MessageTimestamp) => {


  const _all = async roomId => {
    const messageTimestamps = roomId ?
      await MessageTimestamp.findByRoomId(roomId) :
      await MessageTimestamp.all();
    const key = helpers.key;
    const results = messageTimestamps.map(async mt => {
      return await redis.hgetall(`${ key }:${ mt.messageId }`);
    });
    return await Promise.all(results);
  };


  const Message = { helpers };


  Message.create = async ({ body, username, roomId }) => {
    const id = await helpers.next.id.get();
    const key = await helpers.next.key.get();

    const date = new Date();
    const createdAt = date.toISOString();
    const messageTimestamp = await MessageTimestamp.create({
      roomId,
      messageId: id
    });

    const options = { id, body, username, roomId, createdAt };

    await redis.hmset(key, options);
    const result = await redis.hgetall(key);
    await helpers.next.id.set();
    return result;
  };


  Message.all = async () => {
    return await _all();
  };


  Message.findByRoomId = async roomId => {
    return await _all(roomId);
  };


  return Message;
};
