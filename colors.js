/*
	var colors = require('colors');
	 
	console.log('el texto verde'.green);
	console.log('texto subrrallado en rojo'.underline.red);
	console.log('invierte el color'.inverse);
	console.log('color arcoiris'.rainbow);
	console.log('tipo dark'.trap);
	*/
/*
	console.log('el texto verde');
	console.log('texto subrrallado');
	console.log('invierte el color');
	console.log('color arcoiris');
	console.log('tipo dark');
 */

 var colors = require('colors');
 
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});
 
// outputs red text
console.log("this is an error".error);
 
// outputs yellow text
console.log("this is a warning".warn);