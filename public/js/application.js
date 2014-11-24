"use strict";angular.module("betaberry.darkhounds.net",["core.darkhounds.net"]),angular.module("betaberry.darkhounds.net").factory("serviceAPI",["observable","serviceRemote",function(a,b){var c=a.create();return c.login=function(a,d,e){b.login(a,d,function(a){e&&"function"==typeof e&&e(a),a.error||c.$broadcast("logedin",a.data)});return c},c.logout=function(a){b.logout(function(b){a&&"function"==typeof a&&a(b),b.error||c.$broadcast("logedout",b.data)});return c},c.bet=function(a,d,e){b.bet(a,d,function(a){e&&"function"==typeof e&&e(a),a.error||c.$broadcast("betted",a.data)});return c},c.play=function(a,d){b.play(a,function(a){d&&"function"==typeof d&&d(a),a.error||c.$broadcast("played",a.data)});return c},c}]),angular.module("betaberry.darkhounds.net").factory("serviceGame",["observable","serviceAPI",function(a,b){var c=a.create(),d=null;c.hasBetted=function(){return!!d},c.getBet=function(){return d},c.getBetAmount=function(){return d?d.amount:0},c.getBetLevel=function(){return d?d.level:1};var e=null;c.getSlots=function(){return e||[]};var f=!0;c.isClosed=function(){return f};var g=null;c.getPuzzle=function(){return g||[]};var h=0;return c.getGain=function(){return h||[]},b.$on("logedin",function(){d=null,f=!1,g=null,e=null,h=0,c.$broadcast("changed")}),b.$on("logedout",function(){d=null,f=!1,g=null,e=null,h=0,c.$broadcast("changed")}),b.$on("betted",function(a){d=a,f=!d,g=null,e=null,h=0,c.$broadcast("changed")}),b.$on("played",function(a){f=!d||a.closed,g=a.puzzle||[],e=a.slots||[],h=a.gain||0,c.$broadcast("changed")}),c.bet=function(a,d,e){return b.bet(a,d,e),c},c.play=function(a,d){return b.play(a,d),c},c}]),angular.module("betaberry.darkhounds.net").factory("serviceRemote",[function(){function a(){return{response:{data:null,error:null}}}function b(){o=null,p=null,q.length=0}function c(){var a=d(n,null,!0),b={honney:e(a,s),berries:e(a,t),traps:e(a,u),bees:e(a,v)},c=d(n,"");return g(c,b.honney,"honey"),g(c,b.berries,"berry"),g(c,b.traps,"trap"),g(c,b.bees,"bee"),c}function d(a,b,c){for(var d=[],e=0;a>e;e++){d[e]=[];for(var f=0;a>f;f++)d[e][f]=c?f:b}return d}function e(a,b){for(var c=[],d=0;b>d;d++)c.push(f(a));return c}function f(a){var b=Math.round(Math.random()*(a.length-1)),c=Math.round(Math.random()*(a[b].length-1)),d=[b,a[b].splice(c,1)[0]];return a[b].length||a.splice(b,1),d}function g(a,b,c){for(var d in b)a[b[d][0]][b[d][1]]=c}function h(a,b){for(var c in a)if(a[c][0]==b[0]&&a[c][1]==b[1])return!0;return!1}function i(a){var b=[];for(var c in a)for(var d in a[c])b.push([1*c,1*d,a[c][d]]);return b}function j(a,b){var c=!1,d=!1,e=0;for(var f in a)switch(a[f][2]){case"trap":d=!0;break;case"bee":c=!0;break;case"honey":e+=3;break;case"berry":e+=2}e||!d&&!c||(e=1);var g=(d?-3:c?-2:1)*e*b.amount*b.level-b.amount;return g}function k(a,b,c){var d=[];d.push(0>=a||0>=b?null:c[a-1][b-1]),d.push(0>=a?null:c[a-1][b]),d.push(0>=a||b>=n-1?null:c[a-1][b+1]),d.push(0>=b?null:c[a][b-1]),d.push(b>=n-1?null:c[a][b+1]),d.push(a>=n-1||0>=b?null:c[a+1][b-1]),d.push(a>=n-1?null:c[a+1][b]),d.push(a>=n-1||b>=n-1?null:c[a+1][b+1]);var e=0;for(var f in d)d[f]&&(e+=l(d[f]));return e}function l(a){switch(a){case"bee":return 1;case"trap":return 1;case"berry":return-1;case"honey":return-1;default:return 0}}var m={},n=5,o=null,p=null,q=[],r=null;m.login=function(c,d,e){var f=a();return r?f.response.error={code:"sessionNotClosed",msg:"Session Not Closed!"}:(r={name:"Jhon",lastName:"Doe",credits:1e3},f.response.data={name:"Jhon",lastName:"Doe",credits:1e3}),b(),e&&"function"==typeof e&&e(f.response),f},m.logout=function(c){var d=a();return r?(r=null,d.response.data={}):d.response.error={code:"sessionNotOpened",msg:"Session Not Opened!"},b(),c&&"function"==typeof c&&c(d.response),d},m.bet=function(b,d,e){var f=a();return r?o?f.response.error={code:"betOpened",msg:"Bet Already opened"}:!b||isNaN(b)||1>b?f.response.error={code:"betInvalidAmount",msg:"Invalid bet amount"}:b>r.credits?f.response.error={code:"betToHigh",msg:"Bet is to high"}:!d||isNaN(d)||1>d||d>4?f.response.error={code:"betInvalidLevel",msg:"Bet has an invalid level"}:(p=c(),o=f.response.data={amount:b,level:d}):f.response.error={code:"sessionClosed",msg:"Session closed"},e&&"function"==typeof e&&e(f.response),f};var s=1,t=2,u=1,v=2;return m.play=function(c,d){var e=a();if(r?o?h(q,c)&&(e.response.error={code:"slotAlreadyPlayed",msg:"The played slot was already played"}):e.response.error={code:"betClosed",msg:"No Bet Opened"}:e.response.error={code:"sessionClosed",msg:"Session Closed"},!e.response.error){var f=p[c[0]][c[1]];if(c.push(f),c.push(k(c[0],c[1],p)),q.push(c),e.response.data={closed:q.length>=o.level||"trap"==f||"bee"==f,slots:q.slice()},e.response.data.closed){var g=j(q,o);r.credits=r.credits+g,r.credits<0&&(r.credits=0),e.response.data.gain=g,e.response.data.credits=r.credits,e.response.data.puzzle=i(p),b()}}return d&&"function"==typeof d&&d(e.response),e},m}]),angular.module("betaberry.darkhounds.net").factory("serviceSession",["observable","serviceAPI",function(a,b){var c=a.create(),d=null;return b.$on("logedin",function(a){d=a,c.$broadcast("changed")}),b.$on("logedout",function(){d=null,c.$broadcast("changed")}),b.$on("played",function(a){d.credits=a.credits,c.$broadcast("changed")}),c.login=function(a,d,e){return b.login(a,d,e),c},c.logout=function(a){return b.logout(a),c},c.isOpen=function(){return!!d},c.getName=function(){if(!d)return"";var a="";return d.name&&(a+=d.name),d.lastName&&(a+=(a?" ":"")+d.lastName),a},c.getCredits=function(){return d?d.credits:0},c}]),angular.module("betaberry.darkhounds.net").directive("board",[function(){return{scope:{},transcode:!0,replace:!0,templateUrl:"html/templates/board.html",controller:["$scope","serviceSession","serviceGame",function(a,b,c){function d(a,b,c){for(var d=0;5>d;d++){a[d]||(a[d]=[]);for(var e=0;5>e;e++)a[d][e]?(a[d][e].hidden=!0,a[d][e].selected=!1,a[d][e].token=""):a[d][e]={row:d,col:e,hidden:!0,selected:!1,token:""}}for(var f in b){var g=a[b[f][0]][b[f][1]];g.token=b[f][2],g.danger=b[f][3],g.hidden=!1,g.selected=!0}for(var f in c){var g=a[c[f][0]][c[f][1]];g.token=c[f][2],g.hidden=!1}}a.amount=10,a.isLogged=b.isOpen(),a.hasBetted=c.hasBetted(),a.isOver=c.isClosed(),a.gain=c.getGain(),a.rows=[],b.$on("changed",function(){a.isLogged=b.isOpen(),a.hasBetted=!1,a.isOver=!1,a.gain=0,a.$apply()}),c.$on("changed",function(){a.hasBetted=c.hasBetted(),a.isOver=c.isClosed(),a.gain=c.getGain(),d(a.rows,c.getSlots(),c.getPuzzle()),a.$apply()}),a.bet=function(a,b){c.bet(a,b)},a.play=function(a,b){c.play([a,b])},d(a.rows)}]}}]),angular.module("betaberry.darkhounds.net").directive("profile",[function(){return{scope:{},transcode:!0,replace:!0,templateUrl:"html/templates/profile.html",controller:["$scope","serviceSession",function(a,b){a.isLogged=b.isOpen(),a.name="",a.credits=b.isOpen(),b.$on("changed",function(){a.isLogged=b.isOpen(),a.name=b.getName(),a.credits=b.getCredits(),a.$apply()}),a.login=function(){b.login(a.username,a.password)},a.logout=function(){b.logout()}}]}}]),angular.module("betaberry.darkhounds.net").directive("slot",[function(){return{scope:{item:"="},transcode:!0,replace:!0,templateUrl:"html/templates/slot.html",controller:["$scope","serviceGame",function(a,b){function c(a){return!a||a.hidden?"hidden":a.token?a.token:"empty"}a.state="hidden",a.selected=!1,a.danger=0,a.play=function(){a.item.selected||b.play([a.item.row,a.item.col])},a.$watch("item",function(){a.state=c(a.item),a.selected=a.item?a.item.selected:!1,a.danger=a.item&&a.item.danger?Math.round(a.item.danger/8*100):0},!0)}]}}]),angular.module("betaberry.darkhounds.net").directive("viewport",[function(){return{scope:{},transcode:!0,replace:!0,templateUrl:"html/templates/viewport.html",controller:["$scope",function(){}]}}]);