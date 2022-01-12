const WebSocketClient = require('ws');

const log = require('../../../libs/logger')(module);

const {
  sendData,
} = require('../../../websocket/websocket-server');

const {
  sendMessage,
} = require('../../../controllers/telegram/utils/send-message');

const {
  create1mCandles,
} = require('../../../controllers/candles/utils/create-1m-candles');

const {
  ACTION_NAMES,
} = require('../../../websocket/constants');

const CONNECTION_NAME = 'Futures:Kline_1m';

class InstrumentQueue {
  constructor() {
    this.queue = [];
    this.isActive = false;

    this.LIMITER = 50;
  }

  addIteration(obj) {
    this.queue.push(obj);

    if (!this.isActive) {
      this.isActive = true;
      this.nextStep();
    }
  }

  async nextStep() {
    const lQueue = this.queue.length;

    if (lQueue > 0) {
      const targetSteps = this.queue.splice(0, this.LIMITER);
      const resultCreate = await create1mCandles(targetSteps);

      if (!resultCreate || !resultCreate.status) {
        log.warn(resultCreate.message || 'Cant create1mCandles (futures)');
        return this.nextStep();
      }

      setTimeout(() => {
        return this.nextStep();
      }, 2000);
    } else {
      this.isActive = false;
    }
  }
}

module.exports = async (instrumentsDocs = []) => {
  try {
    if (!instrumentsDocs || !instrumentsDocs.length) {
      return true;
    }

    let sendPongInterval;
    let connectStr = 'wss://fstream.binance.com/stream?streams=';

    instrumentsDocs.forEach(doc => {
      const cutName = doc.name.toLowerCase().replace('perp', '');
      connectStr += `${cutName}@kline_1m/`;
    });

    const instrumentQueue = new InstrumentQueue();
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
            k: {
              t: startTime,
              o: open,
              c: close,
              h: high,
              l: low,
              v: volume,
              x: isClosed,
            },
          },
        } = parsedData;

        const validInstrumentName = `${instrumentName}PERP`;
        const instrumentDoc = instrumentsDocs.find(doc => doc.name === validInstrumentName);

        const sendObj = {
          instrumentId: instrumentDoc._id,
          instrumentName: instrumentDoc.name,
          startTime: new Date(startTime),
          open: parseFloat(open),
          close: parseFloat(close),
          high: parseFloat(high),
          low: parseFloat(low),
          volume: parseFloat(volume),
          isClosed,
        };

        if (isClosed) {
          instrumentQueue.addIteration(sendObj);
        }

        sendData({
          actionName: ACTION_NAMES.get('futuresCandle1mData'),
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
