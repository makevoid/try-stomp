const stompit = require('stompit')

const connectOptions = {
  'host': 'b-4fe80089-483d-4bfa-8bda-ca24350b4fcb-1.mq.eu-west-1.amazonaws.com',
  'port': 61614,
  ssl: true,
  'connectHeaders':{
    'host': '/',
    'login': 'amazon-mq-dev-ab',
    'passcode': require('./passcode'),
  }
}

stompit.connect(connectOptions, (error, client) => {

  if (error) {
    console.log(`connect error ${error.message}`)
    return
  }

  const sendHeaders = {
    'destination': '/queue/test',
    'content-type': 'text/plain'
  }

  const frame = client.send(sendHeaders)
  frame.write('hello')
  frame.end()

  const subscribeHeaders = {
    'destination': '/queue/test',
    'ack': 'client-individual'
  }

  client.subscribe(subscribeHeaders, (error, message) => {

    if (error) {
      console.log(`subscribe error ${error.message}`)
      return
    }

    message.readString('utf-8', (error, body) => {

      if (error) {
        console.log(`read message error ${error.message}`)
        return
      }

      console.log(`received message: ${body}`)
      client.ack(message)

      client.disconnect()
    })
  })
})
