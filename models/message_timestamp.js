const _ = require('lodash');


module.exports = redis => {

  const _prefix = 'message_timestamps';


  const MessageTimestamp = {};


  MessageTimestamp.create = async messageId => {
    const timestamp = new Date().getTime();
    await redis.zadd(_prefix, timestamp, messageId);
    return { timestamp, messageId };
  };


  MessageTimestamp.all = async () => {
    const results = await redis.zrangebyscore(_prefix, '-inf', '+inf', 'WITHSCORES');
    return _.chunk(results, 2).map(mt => ({
      messageId: +mt[0],
      timestamp: +mt[1]
    }));
  };


  return MessageTimestamp;
};












