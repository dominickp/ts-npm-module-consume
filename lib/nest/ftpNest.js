"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var nest_1 = require("./nest");
var ftpFileJob_1 = require("./../job/ftpFileJob");
var EasyFtp = require("easy-ftp"), tmp = require("tmp"), fs = require("fs"), async = require("async");
var FtpNest = (function (_super) {
    __extends(FtpNest, _super);
    function FtpNest(e, host, port, username, password, checkEvery) {
        _super.call(this, e, host);
        this.config = {
            host: host,
            port: port,
            username: username,
            password: password
        };
        this.checkEvery = checkEvery;
        this.checkEveryMs = this.checkEvery * 60000;
    }
    FtpNest.prototype.getClient = function () {
        return new EasyFtp();
    };
    FtpNest.prototype.load = function () {
        var ftp = this;
        try {
            var ftp_client_1 = ftp.getClient();
            ftp_client_1.connect(ftp.config);
            ftp_client_1.ls("/", function (err, list) {
                if (err) {
                    ftp_client_1.close();
                }
                ftp.e.log(1, "FTP ls found " + list.length + " files.", ftp);
                async.eachSeries(list, function (file, done) {
                    // Create temp file
                    ftp.e.log(1, "FTP found file \"" + file.name + "\".", ftp);
                    var job = new ftpFileJob_1.FtpFileJob(ftp.e, file.name);
                    // Download to the temp job location
                    ftp_client_1.download(file.name, job.path, function (err) {
                        if (err) {
                            ftp.e.log(3, "Download error: \"" + err + "\".", ftp);
                            done();
                        }
                        else {
                            job.locallyAvailable = true;
                            // Delete on success
                            ftp_client_1.rm(file.name, function (err) {
                                if (err) {
                                    ftp.e.log(3, "Remove error: \"" + err + "\".", ftp);
                                }
                                ftp.arrive(job);
                                done();
                            });
                        }
                    });
                }, function (err) {
                    if (err) {
                        ftp.e.log(3, "Async series download error: \"" + err + "\".", ftp);
                    }
                    ftp.e.log(0, "Completed " + list.length + " synchronous download(s).", ftp);
                    ftp_client_1.close();
                });
                //
                // list.forEach(function (file, index) {
                //
                // });
            });
        }
        catch (e) {
            ftp.e.log(3, e, ftp);
        }
    };
    FtpNest.prototype.watch = function () {
        var ftp = this;
        ftp.e.log(1, "Watching FTP directory.", ftp);
        var count = 0;
        setInterval(function () {
            count++;
            ftp.e.log(1, "Re-checking FTP, attempt " + count + ".", ftp);
            ftp.load();
        }, ftp.checkEveryMs, count);
    };
    FtpNest.prototype.arrive = function (job) {
        _super.prototype.arrive.call(this, job);
    };
    FtpNest.prototype.take = function (job, callback) {
        var ftp = this;
        try {
            var ftp_path = "/" + job.name;
            var ftp_client_2 = ftp.getClient();
            ftp_client_2.connect(ftp.config);
            ftp_client_2.upload(job.path, ftp_path, function (err) {
                if (err) {
                    ftp.e.log(3, "Error uploading " + job.name + " to FTP.", ftp);
                }
                fs.unlinkSync(job.path);
                ftp_client_2.close();
                var ftpJob = job;
                ftpJob.locallyAvailable = false;
                callback(ftpJob);
            });
        }
        catch (e) {
            ftp.e.log(3, "Take upload error, " + e, ftp);
        }
    };
    return FtpNest;
}(nest_1.Nest));
exports.FtpNest = FtpNest;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFDLENBQUMsQ0FBQztZQUNULEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxxQkFBcUIsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakQsQ0FBQztJQUNMLENBQUM7SUFFTCxjQUFDO0FBQUQsQ0FqSUEsQUFpSUMsQ0FqSTRCLFdBQUksR0FpSWhDO0FBaklZLGVBQU8sVUFpSW5CLENBQUEiLCJmaWxlIjoibGliL25lc3QvZnRwTmVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5lc3QgfSBmcm9tIFwiLi9uZXN0XCI7XG5pbXBvcnQgeyBGaWxlSm9iIH0gZnJvbSBcIi4vLi4vam9iL2ZpbGVKb2JcIjtcbmltcG9ydCB7IEZ0cEZpbGVKb2IgfSBmcm9tIFwiLi8uLi9qb2IvZnRwRmlsZUpvYlwiO1xuXG5jb25zdCAgIEVhc3lGdHAgPSByZXF1aXJlKFwiZWFzeS1mdHBcIiksXG4gICAgICAgIHRtcCA9IHJlcXVpcmUoXCJ0bXBcIiksXG4gICAgICAgIGZzID0gcmVxdWlyZShcImZzXCIpLFxuICAgICAgICBhc3luYyA9IHJlcXVpcmUoXCJhc3luY1wiKTtcblxuaW1wb3J0IHtFbnZpcm9ubWVudH0gZnJvbSBcIi4uL2Vudmlyb25tZW50L2Vudmlyb25tZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBGdHBOZXN0IGV4dGVuZHMgTmVzdCB7XG5cbiAgICBwcm90ZWN0ZWQgY2xpZW50OiBhbnk7XG4gICAgcHJvdGVjdGVkIGNvbmZpZzoge307XG4gICAgcHJvdGVjdGVkIGNoZWNrRXZlcnk6IG51bWJlcjtcbiAgICBwcm90ZWN0ZWQgY2hlY2tFdmVyeU1zOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlOiBFbnZpcm9ubWVudCwgaG9zdDogc3RyaW5nLCBwb3J0OiBudW1iZXIsIHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIGNoZWNrRXZlcnk6IG51bWJlcikge1xuICAgICAgICBzdXBlcihlLCBob3N0KTtcblxuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIGhvc3Q6IGhvc3QsXG4gICAgICAgICAgICBwb3J0OiBwb3J0LFxuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5jaGVja0V2ZXJ5ID0gY2hlY2tFdmVyeTtcblxuICAgICAgICB0aGlzLmNoZWNrRXZlcnlNcyA9IHRoaXMuY2hlY2tFdmVyeSAqIDYwMDAwO1xuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldENsaWVudCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFYXN5RnRwKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWQoKSB7XG5cbiAgICAgICAgbGV0IGZ0cCA9IHRoaXM7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBmdHBfY2xpZW50ID0gZnRwLmdldENsaWVudCgpO1xuICAgICAgICAgICAgZnRwX2NsaWVudC5jb25uZWN0KGZ0cC5jb25maWcpO1xuXG4gICAgICAgICAgICBmdHBfY2xpZW50LmxzKFwiL1wiLCBmdW5jdGlvbihlcnIsIGxpc3QpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZnRwX2NsaWVudC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ0cC5lLmxvZygxLCBgRlRQIGxzIGZvdW5kICR7bGlzdC5sZW5ndGh9IGZpbGVzLmAsIGZ0cCk7XG5cblxuICAgICAgICAgICAgICAgIGFzeW5jLmVhY2hTZXJpZXMobGlzdCwgZnVuY3Rpb24gKGZpbGUsIGRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHRlbXAgZmlsZVxuICAgICAgICAgICAgICAgICAgICBmdHAuZS5sb2coMSwgYEZUUCBmb3VuZCBmaWxlIFwiJHtmaWxlLm5hbWV9XCIuYCwgZnRwKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGpvYiA9IG5ldyBGdHBGaWxlSm9iKGZ0cC5lLCBmaWxlLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERvd25sb2FkIHRvIHRoZSB0ZW1wIGpvYiBsb2NhdGlvblxuICAgICAgICAgICAgICAgICAgICBmdHBfY2xpZW50LmRvd25sb2FkKGZpbGUubmFtZSwgam9iLnBhdGgsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdHAuZS5sb2coMywgYERvd25sb2FkIGVycm9yOiBcIiR7ZXJyfVwiLmAsIGZ0cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2IubG9jYWxseUF2YWlsYWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVsZXRlIG9uIHN1Y2Nlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdHBfY2xpZW50LnJtKGZpbGUubmFtZSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdHAuZS5sb2coMywgYFJlbW92ZSBlcnJvcjogXCIke2Vycn1cIi5gLCBmdHApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ0cC5hcnJpdmUoam9iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ0cC5lLmxvZygzLCBgQXN5bmMgc2VyaWVzIGRvd25sb2FkIGVycm9yOiBcIiR7ZXJyfVwiLmAsIGZ0cCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZnRwLmUubG9nKDAsIGBDb21wbGV0ZWQgJHtsaXN0Lmxlbmd0aH0gc3luY2hyb25vdXMgZG93bmxvYWQocykuYCwgZnRwKTtcbiAgICAgICAgICAgICAgICAgICAgZnRwX2NsaWVudC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZnRwLmUubG9nKDMsIGUsIGZ0cCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgd2F0Y2goKSB7XG4gICAgICAgIGxldCBmdHAgPSB0aGlzO1xuXG4gICAgICAgIGZ0cC5lLmxvZygxLCBcIldhdGNoaW5nIEZUUCBkaXJlY3RvcnkuXCIsIGZ0cCk7XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcblxuICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBmdHAuZS5sb2coMSwgYFJlLWNoZWNraW5nIEZUUCwgYXR0ZW1wdCAke2NvdW50fS5gLCBmdHApO1xuICAgICAgICAgICAgZnRwLmxvYWQoKTtcbiAgICAgICAgfSwgZnRwLmNoZWNrRXZlcnlNcywgY291bnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhcnJpdmUoam9iOiBGaWxlSm9iKSB7XG4gICAgICAgIHN1cGVyLmFycml2ZShqb2IpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0YWtlKGpvYjogRmlsZUpvYiwgY2FsbGJhY2s6IGFueSkge1xuICAgICAgICBsZXQgZnRwID0gdGhpcztcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGZ0cF9wYXRoID0gYC8ke2pvYi5uYW1lfWA7XG5cbiAgICAgICAgICAgIGxldCBmdHBfY2xpZW50ID0gZnRwLmdldENsaWVudCgpO1xuXG4gICAgICAgICAgICBmdHBfY2xpZW50LmNvbm5lY3QoZnRwLmNvbmZpZyk7XG5cbiAgICAgICAgICAgIGZ0cF9jbGllbnQudXBsb2FkKGpvYi5wYXRoLCBmdHBfcGF0aCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZnRwLmUubG9nKDMsIGBFcnJvciB1cGxvYWRpbmcgJHtqb2IubmFtZX0gdG8gRlRQLmAsIGZ0cCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnMudW5saW5rU3luYyhqb2IucGF0aCk7XG4gICAgICAgICAgICAgICAgZnRwX2NsaWVudC5jbG9zZSgpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZ0cEpvYiA9IGpvYiBhcyBGdHBGaWxlSm9iO1xuICAgICAgICAgICAgICAgIGZ0cEpvYi5sb2NhbGx5QXZhaWxhYmxlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhmdHBKb2IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGZ0cC5lLmxvZygzLCBcIlRha2UgdXBsb2FkIGVycm9yLCBcIiArIGUsIGZ0cCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iXX0=
