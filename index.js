var Bitcore = require('bitcore-lib-dash');
var Message = require('bitcore-message-dash');

var mnPrivateKey = '92ptYNcW8Jyhw8VKe6auXxGs6z5QLHPW22jzJz9RLyq8gkTTnPc';
var vinMasternode = 'a2cdaae1c966cb367f35411ac672d3c4872be4fc0716795b5f22f0a73b6db465-1';

// retrieve via insight-api-dash, e.g. /insight-api-dash/gobject/list/proposal or /insight-api-dash/gobject/get/:hash

var parentHash = '59d99935eb254ebee5723fba57b45722712192c009c1638bf64dd90b216e8264';

var voteSignal = 1; // 'funding'
var voteOutcome = 2; // 'no'

var time = Math.floor(Date.now() / 1000);

var message = vinMasternode + '|' + parentHash + '|' + voteSignal + '|' + voteOutcome + '|' + time;
var privateKey = Bitcore.PrivateKey.fromWIF(mnPrivateKey);
var signature = Message(message).sign(privateKey);
var verified = Message(message).verify(privateKey.toAddress(), signature);

console.log("time: " + time);
console.log("message: " + message);
console.log("vote-sig: " + signature);
console.log("verified: " + verified);

var masterNodeTx = vinMasternode.split('-');

var vote;

// Note: RPC command uses english, signed vote message uses numbers
if (voteOutcome == 0) vote = "abstain";
if (voteOutcome == 1) vote = "yes";
if (voteOutcome == 2) vote = "no";

// voteraw masternode-tx-hash masternode-tx-index governance-hash vote-signal [yes|no|abstain] time vote-sig
var rpcCommand = "voteraw " + masterNodeTx[0] + " " + masterNodeTx[1] + " " + parentHash + " funding " + vote + " " + time + " " + signature;

console.log("-");
console.log("rpc command: " + rpcCommand);
