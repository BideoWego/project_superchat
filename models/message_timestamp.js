const _ = require('lodash');


module.exports = redis => {


  const _all = async (roomId='*') => {
    const results = await redis.zrangebyscore(
      `${ _prefix }:${ roomId }`,
      '-inf',
      '+inf',
      'WITHSCORES'
    );

    return _.chunk(results, 2).map(mt => ({
      messageId: +mt[0],
      timestamp: +mt[1]
    }));
  };

  const _prefix = 'message_timestamps';


  const MessageTimestamp = {};


  MessageTimestamp.create = async ({ roomId, messageId }) => {
    const timestamp = new Date().getTime();

    await redis.zadd(`${ _prefix }:${ roomId }`, timestamp, messageId);
    return { timestamp, messageId };
  };


  MessageTimestamp.all = async () => {
    return await _all();
  };


  MessageTimestamp.findByRoomId = async roomId => {
    return _all(roomId);
  };


  return MessageTimestamp;
};
