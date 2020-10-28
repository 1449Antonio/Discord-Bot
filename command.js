const {prefix} = require('./config.json')

module.exports = (client, aliases, callback) => {
    if (typeof aliases == 'string'){
        aliases = [aliases]
    }
    client.on('message', message => {
        aliases.forEach(alias => {
            const cmd = `${prefix}${alias}`

            if (message.content.startsWith(`${cmd} `) || message.content === cmd)
                callback(message)
        })
    })
}