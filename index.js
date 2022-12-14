const tgApi = require('node-telegram-bot-api')

const token = '5828752059:AAEe6JumvsjwyI77lvecl6XrHzh9moJyML0'

const bot = new tgApi(token, { polling: true })
const chats = {}
const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: '1', callback_data: '1' },
        { text: '2', callback_data: '2' },
        { text: '3', callback_data: '3' },
      ],
      [
        { text: '4', callback_data: '4' },
        { text: '5', callback_data: '5' },
        { text: '6', callback_data: '6' },
      ],
      [
        { text: '7', callback_data: '7' },
        { text: '8', callback_data: '8' },
        { text: '9', callback_data: '9' },
      ],
      [{ text: '0', callback_data: '0' }],
    ],
  }),
}
const againGameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: 'Restart game', callback_data: '/again' }]],
  }),
}
const newGame = async (chatId) => {
  await bot.sendMessage(chatId, 'guess the number from zero to nine')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Guess a number', gameOptions)
}
const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Start bot' },
    { command: '/info', description: 'User info' },
    { command: '/game', description: 'Guess number' },
  ])

  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/2.jpg'
      )
      return bot.sendMessage(chatId, `Hello in telegram bot`)
    }
    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Your name ${msg.from.first_name} ${msg.from.last_name}`
      )
    }
    if (text === '/game') {
      return newGame(chatId)
    }
    return bot.sendMessage(chatId, 'I do not understand you')
  })
  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return newGame(chatId)
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Congratulations yoy guess a number ${chats[chatId]}`,
        againGameOptions
      )
    } else {
      return await bot.sendMessage(
        chatId,
        `Sorry, but you do not guess a number, bot number ${data}`,
        againGameOptions
      )
    }
  })
}

start()
