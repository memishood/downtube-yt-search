/*
localhost:9000/?gorev=ara&arama=mustafa
localhost:9000/?gorev=al&arama=mustafa&video=2
*/
var ATA = {};
ATA.ytSearch = require("yt-search");
ATA.http = require("http");
ATA.system_port = 9000;

ATA.http.createServer(function(request,response) {
	var reqtext = "" + request.url.split("/").join("\\") + "";
	if (reqtext.split("?").length == 1) return;
	var params_ = reqtext.split("?")[1].split("&");
	var params = {};
	var content = "false";
	
	for (var i=0;i<params_.length;i++)
	params["_" + decodeURI(params_[i].split("=")[0]).toUpperCase() + "_"] = decodeURI(params_[i].split("=")[1]).toUpperCase();
	console.log("Bildirim : yeni istek atıldı.");
	console.log(params);
	if (params["_GOREV_"]) switch (params["_GOREV_"]) {
		default:
			response.writeHead(200,{"Content-Type":"application/json"});
			response.end("false","utf-8");
		break;
		case "ARA":
			var sonuc = ATA.ytSearch(params["_ARAMA_"], function ( err, r ) {
				if (err) throw err;
				r.videos.length = 10;
				r.playlists = 0;
				r.accounts = 0;
				content = JSON.stringify(r);
				response.writeHead(200,{"Content-Type":"application/json"});
				response.end(content,"utf-8");
			});
		break;
		case "AL":
			var sonuc = ATA.ytSearch(params["_ARAMA_"], function ( err, r ) {
				if (err) throw err;
				var index = params["_VIDEO_"]?parseInt(params["_VIDEO_"]):0;
				content = JSON.stringify(r.videos[index]);
				response.writeHead(200,{"Content-Type":"application/json"});
				response.end(content,"utf-8");
			});
		break;
	}
}).listen(ATA.system_port);
console.log("Başlatıldı.");