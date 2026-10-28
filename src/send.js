// Sends one message through `transport`, retrying transient failures up to `attempts` times.
export async function send(transport, message, { attempts = 3 } = {}) {
  if (!message.to || !message.text) throw new TypeError('message needs `to` and `text`');
  if (!(attempts >= 1 && attempts <= 10)) throw new RangeError('attempts must be from 1 to 10');
  let last;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await transport(message);
    } catch (error) {
      last = error;
      if (!error.transient) break;
    }
  }
  throw last;
}
