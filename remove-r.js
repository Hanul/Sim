require('uppercase-core');

WRITE_FILE({
	path : 'Example/HelloWorld.sim',
	isSync : true,
	content : READ_FILE({
		path : 'Example/HelloWorld.sim',
		isSync : true
	}).toString().replace(/\r/g, '')
});