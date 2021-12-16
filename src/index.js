import 'bootstrap';
import 'bootstrap/js/dist/modal.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './app';
import init from './init';

const { state, elements } = init();
app(state, elements);
