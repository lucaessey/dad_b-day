import test from 'node:test';
import assert from 'node:assert/strict';
import {COUPONS,JOKES} from './data.mjs';
import {answerMatches,cleanState,redeem,dayNumber,archiveIndices,jokeAt,dateAt} from './logic.mjs';
test('birthday and archive change at Los Angeles midnight',()=>{
 assert.equal(dayNumber(new Date('2026-11-26T07:59:59Z')),-1);
 assert.equal(dayNumber(new Date('2026-11-26T08:00:00Z')),0);
 assert.equal(dayNumber(new Date('2026-11-27T08:00:00Z')),1);
 assert.deepEqual(archiveIndices(0),[]);
 assert.deepEqual(archiveIndices(1),[0]);
 assert.deepEqual(archiveIndices(5),[4,3,2,1,0]);
 assert.equal(dateAt(0),'Nov 26, 2026');
 assert.equal(dateAt(5),'Dec 1, 2026');
});
test('archive includes missed visits and paginates without including today',()=>{
 assert.equal(archiveIndices(500).length,24);
 assert.equal(archiveIndices(500)[0],499);
 assert.equal(archiveIndices(500,24)[0],475);
 assert.deepEqual(archiveIndices(2,24),[]);
 assert.deepEqual(jokeAt(JOKES.length),jokeAt(0));
 for(let i=0;i<JOKES.length;i++)assert.notDeepEqual(jokeAt(i),jokeAt(i+1));
});
test('all requested answers, paraphrases, and common typos unlock the correct gifts',()=>{
 const cases=[
 ['family sunset walk','a stroll at dusk','a famly sunsset walk'],
 ['kid free morning coffee','a quiet cafe date','kid-free coffe'],
 ['one youtuber food meal','eat at a restaurant from YouTube','youtubr food meal'],
 ['two family game nights','family boardgames','two game nigths'],
 ['dads chose movie night','Dad picks a film','dads movie choise'],
 ['shopping spree for dad only','shopping for Warren','shoping spree for dad'],
 ['meal made kids','dinner cooked by the children','a meal made by the kdis']
 ];
 COUPONS.forEach((c,i)=>cases[i].forEach(a=>assert.ok(answerMatches(c,a),c.id+': '+a)));
});
test('empty, unrelated, and incomplete guesses do not unlock gifts',()=>{
 for(const c of COUPONS){for(const a of ['', 'I do not know','birthday cake','family','what am I','?'])assert.equal(answerMatches(c,a),false,c.id+': '+a);}
 assert.equal(answerMatches(COUPONS[0],'family sunrise walk'),false);
 assert.equal(answerMatches(COUPONS[1],'morning cartoons'),false);
});
test('game night has two uses; others have one; locked and spent gifts cannot be used',()=>{
 for(const c of COUPONS){
 let s=cleanState({});
 assert.equal(redeem(s,c.id).success,false);
 s[c.id].unlocked=true;
 for(let i=0;i<c.total;i++){const r=redeem(s,c.id);assert.equal(r.success,true);s=r.state;assert.equal(s[c.id].used,i+1);}
 const spent=redeem(s,c.id);assert.equal(spent.success,false);assert.equal(spent.state[c.id].used,c.total);
 }
});
test('persisted state round-trips and malformed counts cannot add uses',()=>{
 const s=cleanState({games:{unlocked:true,used:1},coffee:{unlocked:true,used:1}});
 assert.deepEqual(cleanState(JSON.parse(JSON.stringify(s))),s);
 assert.equal(cleanState({games:{unlocked:true,used:999}}).games.used,2);
 assert.equal(cleanState({games:{unlocked:true,used:-1}}).games.used,0);
 assert.equal(cleanState({games:{unlocked:false,used:2}}).games.used,0);
 assert.equal(cleanState({games:{unlocked:true,used:1.5}}).games.used,0);
 assert.equal(redeem(s,'unknown').success,false);
});
