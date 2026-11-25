import {COUPONS,JOKES} from './data.mjs';
export const BIRTHDAY='2026-11-26';
export const TIME_ZONE='America/Los_Angeles';
export const STORAGE_KEY='warren-birthday-v1';
const DAY=86400000;
export function dateKey(now=new Date()) {
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const get=t=>parts.find(p=>p.type===t).value;
  return get('year')+'-'+get('month')+'-'+get('day');
}
export function dayNumber(now=new Date()) {return Math.floor((Date.parse(dateKey(now)+'T00:00:00Z')-Date.parse(BIRTHDAY+'T00:00:00Z'))/DAY);}
export function jokeAt(index) {return JOKES[((index%JOKES.length)+JOKES.length)%JOKES.length];}
export function dateAt(index) {return new Date(Date.parse(BIRTHDAY+'T12:00:00Z')+index*DAY).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});}
export function archiveIndices(day,offset=0,limit=24) {return Array.from({length:Math.max(0,Math.min(limit,day-offset))},(_,i)=>day-1-offset-i);}
export function normalize(s){return s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
export function distance(a,b) {const d=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));for(let i=0;i<=a.length;i++)d[i][0]=i;for(let j=0;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);}return d[a.length][b.length];}
export function answerMatches(coupon,answer) {
  const text=normalize(answer);if(text.length<3||text.length>200)return false;
  const tokens=text.split(' ');
  return coupon.groups.every(group=>group.some(word=>tokens.some(token=>token===word||(Math.min(token.length,word.length)>=4&&distance(token,word)<=(Math.min(token.length,word.length)>=7?2:1)))));
}
export function cleanState(raw) {
  const out={};for(const c of COUPONS){const v=raw?.[c.id];out[c.id]={unlocked:v?.unlocked===true,used:v?.unlocked===true&&Number.isInteger(v?.used)?Math.max(0,Math.min(c.total,v.used)):0};}return out;
}
export function redeem(state,id) {
  const next=cleanState(state),coupon=COUPONS.find(c=>c.id===id);
  if(!coupon||!next[id].unlocked||next[id].used>=coupon.total)return {state:next,success:false};
  next[id].used++;return {state:next,success:true};
}
