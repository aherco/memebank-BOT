import Discord from 'discord.js';
import request from 'superagent';

export default class DeletionCollector extends Discord.Collector {
  constructor(client, filter, options = {}) {
    super(client, filter, options);

    setInterval(() => {
    	if (this.collected.size > 0) {

    	  console.log('Deletion batch size: ', this.collected.size);
    	  console.log([...this.collected.values()]);

          request
            .delete('https://1t7lfirpvc.execute-api.us-east-1.amazonaws.com/dev/items')
            .send({ batch: [...this.collected.values()] })
            .then((res) => { /* does not add items to db unless .then() is called */ })
            .catch((err) => { /* kinda same with this one, i will look into it */ })
    	  ;

  	  this.collected = new Discord.Collection();
      }
    }, 5000);
  }

  handle(message) {
    console.log(message.id);
    return { key: message.id, value: message.id };
  }
}
