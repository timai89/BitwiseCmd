export default {
            encodeHash: function(string) {
                return encodeURI(string.trim().replace(/\s/g,','));
            },
            decodeHash: function(hashValue) {
                return decodeURI(hashValue).replace(/^\#/, '').replace(/,/g,' ');
            },
            getArgs: function (hashValue) {

                var decodedHash = this.decodeHash(hashValue),
                    args = { commands: [] };

                splitHashList(decodedHash).forEach(function(value) {
                    args.commands.push(value);
                });

                return Object.freeze(args);
            }
        };

function splitHashList(str) {
    var values = [];

    if(str.indexOf('||')) {
        str.split('||').forEach(function (v) {
            if (v.length > 0) {
                values.push(v);
            }
        });
    } else {
        values.push(str);
    }

    return values;
}