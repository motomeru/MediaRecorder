'use strict'

// Grab elements from DOM
const ul = document.getElementById('ul');
const gUMbtn = document.getElementById('gUMbtn');
const start = document.getElementById('start');
const stop = document.getElementById('stop');

let stream;
let recorder;
let counter = 1;
let chunks;
let media;

gUMbtn.addEventListener('click', () => {
  const mv = document.getElementById('mediaVideo');
  const mediaOptions = {
    video: {
      tag: 'video',
      type: 'video/webm',
      ext: '.mp4',
      gUM: {video: true, audio: true}
    },
    audio: {
      tag: 'audio',
      type: 'audio/ogg',
      ext: '.ogg',
      gUM: {audio: true}
    }
  };
  media = mv.checked ? mediaOptions.video : mediaOptions.audio;
  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
    stream = _stream;
    document.getElementById('gUMArea').style.display = 'none';
    document.getElementById('btns').style.display = 'inherit';
    start.removeAttribute('disabled');
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
      chunks.push(e.data);
      if(recorder.state == 'inactive')  makeLink();
    };
    console.log('got media successfully');
  }).catch(err => console.log(err));
});

start.addEventListener('click', () => {
  start.disabled = true;
  stop.removeAttribute('disabled');
  chunks = [];
  recorder.start();
});

stop.addEventListener('click', () => {
  stop.disabled = true;
  recorder.stop();
  start.removeAttribute('disabled');
});

function makeLink() {
  let blob = new Blob(chunks, {type: media.type });
  let url = URL.createObjectURL(blob);
  let li = document.createElement('li');
  let mt = document.createElement(media.tag);
  let hf = document.createElement('a');

  mt.controls = true;
  mt.src = url;
  hf.href = url;
  hf.download = `${counter++}${media.ext}`;
  hf.innerHTML = `download ${hf.download}`;
  li.appendChild(mt);
  li.appendChild(hf);
  ul.appendChild(li);
}