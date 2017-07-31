/**
 * Created by funmi on 3/22/17.
 */
exports.log = function (msg, info) {
    var log = msg + JSON.stringify(info);
    return console.log(log);
};