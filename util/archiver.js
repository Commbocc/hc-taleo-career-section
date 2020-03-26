var fs = require('fs');
var archiver = require('archiver');

var output = fs.createWriteStream('./dist.zip');
var archive = archiver('zip', {
    // zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

output.on('end', function () {
    console.log('Data has been drained');
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        console.error(err)
        throw err;
    }
});

archive.on('error', function (err) {
    console.error(err)
    throw err;
});

archive.pipe(output);

// append files from a sub-directory, putting its contents at the root of archive
archive.directory('./dist/', false);

archive.finalize();