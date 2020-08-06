import DeviceMotion from '@zonesoundcreative/web-devicemotion';
import io from 'socket.io-client';
import {server} from './config';

var socket = io(server);
var isConnect = false;
socket.on('connect', ()=>{
    isConnect = true;    
})
let dm = new DeviceMotion(false, callback);
let count = 0;
let sendSpeed = 5;

document.getElementById('start').onclick = () =>{
    dm.requestPermission();
};

document.getElementById('filter').onclick = () =>{
    dm.setFilter(document.getElementById('filter').checked);
};

document.getElementById('number').onchange = () => {
    sendSpeed = document.getElementById('number').value;
    alert('change to '+sendSpeed);
}


function callback() {
    //console.log(JSON.parse(evt));
    //console.log(dm.orient);
    document.getElementById('orient').innerHTML = toString(dm.orient);
    document.getElementById('vel').innerHTML = toString(dm.orientVel);
    document.getElementById('acc').innerHTML = toString(dm.orientAcc);
    count ++;
    if (!isConnect || count%sendSpeed) return;
    
    socket.emit('osc', {
        address: '/gyrosc/gyro',
        args:[{
            value: toSendString(dm.orient)
        }] 
    });
    socket.emit('osc', {
        address: '/gyrosc/vel',
        args:[{
            value: toSendString(dm.orientVel)
        }] 
    });
    socket.emit('osc', {
        address: '/gyrosc/accel',
        args:[{
            value: toSendString(dm.orientAcc)
        }] 
    });

}

function toArray(jsonData) {
    return [jsonData.pitch, jsonData.roll, jsonData.yaw];
}

function toSendString(jsonData) {
    return `${jsonData.pitch} ${jsonData.roll} ${jsonData.yaw}`;
}

function toString(jsonData) {
    let html = "";
    for (let k in jsonData) {
        if (!k) continue;
        html += `${k}: ${jsonData[k]>0?"+":""}${jsonData[k].toFixed(3)} </br>`
    }
    return html;
}