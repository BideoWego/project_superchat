

module.exports = (redis, helpers) => {


  const Room = { helpers };


  Room.create = async ({ name, username }) => {
    const id = await helpers.next.id.get();
    const key = await helpers.next.key.get();

    const date = new Date();
    const createdAt = date.toISOString();

    const options = { id, name, username, createdAt };

    await redis.hmset(key, options);
    const result = await redis.hgetall(key);
    await helpers.next.id.set();
    return result;
  };


  Room.find = async id => {
    const key = helpers.toKey(id);
    return await redis.hgetall(key);
  };


  Room.all = async () => {
    const key = helpers.key;
    const keys = await redis.keys(`${ key }:*`);
    const results = keys.map(async key => await redis.hgetall(key));
    return await Promise.all(results);
  };


  return Room;
};
