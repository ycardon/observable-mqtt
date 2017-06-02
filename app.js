const Rx = require ('rxjs/Rx')
const mqtt = require('mqtt').connect('mqtt://localhost')


function isPrime(value) {
    for (let i=2; i<value; i++) if (value%i===0) return false
    return value>1;
}

// once connected
mqtt.on('connect', ()=>{
    console.info('connected')

    mqtt.subscribe('#')
    mqtt.publish('node/connection', 'je suis connecté')

    // publisher
    Rx.Observable.from(['a', 'b', 'cd', 'efg', 'h', 'ijk', 'lm'])
        .filter( ev=>ev.length<3 )
        .delay(1000)
        .subscribe( ev=>mqtt.publish('node/fromArray', ev) )

    // publisher
    Rx.Observable.interval(100)
        .filter( isPrime )
        .bufferTime(10000)
        .subscribe( ev=>mqtt.publish('node/prime', ev.toString()) )

})

// consumer
Rx.Observable.fromEvent(mqtt, 'message', (topic, message)=>{return {topic, message}} )  // we're converting the useful arguments of the mqtt event into a single object
    .subscribe( ev=>console.log(`${ev.topic} > ${ev.message}`) )



