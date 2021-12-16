import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './app';
import init from './init';

const state = init();
app(state);

console.log('index app', typeof app(state));
