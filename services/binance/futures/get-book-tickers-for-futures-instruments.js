const WebSocketClient = require('ws');

const log = require('../../../libs/logger')(module);

const {
  sendData,
} = require('../../../websocket/websocket-server');

const {
  sendMessage,
} = require('../../../controllers/telegram/utils/send-message');

const {
  ACTION_NAMES,
} = require('../../../websocket/constants');

const CONNECTION_NAME = 'Futures:bookTicker';

module.exports = async (instrumentsDocs = []) => {
  try {
    if (!instrumentsDocs || !instrumentsDocs.length) {
      return true;
    }

    let sendPongInterval;
    let connectStr = 'wss://fstream.binance.com/stream?streams=';

    instrumentsDocs.forEach(doc => {
      const cutName = doc.name.toLowerCase().replace('perp', '');
      connectStr += `${cutName}@bookTicker/`;
    });

    connectStr = connectStr.substring(0, connectStr.length - 1);

    const websocketConnect = () => {
      const client = new WebSocketClient(connectStr);

      client.on('open', () => {
        log.info(`${CONNECTION_NAME} was opened`);

        sendPongInterval = setInterval(() => {
          client.pong();
        }, 1000 * 60); // 1 minute
      });

      client.on('ping', () => {
        client.pong();
      });

      client.on('close', (message) => {
        log.info(`${CONNECTION_NAME} was closed`);

        if (message !== 1006) {
          sendMessage(260325716, `${CONNECTION_NAME} was closed (${message})`);
        }

        clearInterval(sendPongInterval);
        websocketConnect();
      });

      client.on('message', async bufferData => {
        const parsedData = JSON.parse(bufferData.toString());

        if (!parsedData.data || !parsedData.data.s) {
          log.warn(`${CONNECTION_NAME}: ${JSON.stringify(parsedData)}`);
          return true;
        }

        const {
          data: {
            s: instrumentName,
            b: bidPrice,
            a: askPrice,
          },
        } = parsedData;

        const validInstrumentName = `${instrumentName}PERP`;
        const instrumentDoc = instrumentsDocs.find(doc => doc.name === validInstrumentName);

        const sendObj = {
          instrumentId: instrumentDoc._id,
          instrumentName: instrumentDoc.name,
          askPrice: parseFloat(askPrice),
          bidPrice: parseFloat(bidPrice),
        };

        sendData({
          actionName: ACTION_NAMES.get('futuresBookTicker'),
          data: sendObj,
        });
      });
    };

    websocketConnect();
  } catch (error) {
    log.error(error.message);
    console.log(error);
    return false;
  }
};
