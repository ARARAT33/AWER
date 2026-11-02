import { createHmac, timingSafeEqual } from "node:crypto";
const COOKIE="awe_session"; const MAX_AGE=8*60*60;
function secret(){const v=process.env.SESSION_SECRET;if(!v||Buffer.byteLength(v)<32)throw new Error("SESSION_SECRET must contain at least 32 bytes");return v;}
function sign(v){return createHmac("sha256",secret()).update(v).digest("base64url");}
export function createSession(email,now=Date.now()){const p=Buffer.from(JSON.stringify({email,exp:Math.floor(now/1000)+MAX_AGE})).toString("base64url");return p+"."+sign(p);}
export function verifySession(token,now=Date.now()){if(!token||typeof token!=="string")return null;const a=token.split(".");if(a.length!==2)return null;const e=Buffer.from(sign(a[0])),v=Buffer.from(a[1]);if(e.length!==v.length||!timingSafeEqual(e,v))return null;try{const d=JSON.parse(Buffer.from(a[0],"base64url").toString());if(!d.email||!Number.isFinite(d.exp)||d.exp<=Math.floor(now/1000))return null;return {email:d.email};}catch{return null;}}
export function readCookie(req,n){for(const p of (req.headers.cookie||"").split(";")){const i=p.indexOf("=");if(i>=0&&p.slice(0,i).trim()===n)return decodeURIComponent(p.slice(i+1).trim());}return null;}
export function setSessionCookie(res,t){res.setHeader("Set-Cookie",COOKIE+"="+encodeURIComponent(t)+"; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age="+MAX_AGE);}
export function clearSessionCookie(res){res.setHeader("Set-Cookie",COOKIE+"=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0");}
export function requireOwner(req,res){const s=verifySession(readCookie(req,COOKIE));const a=(process.env.ALLOWED_EMAILS||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);if(!s||!a.includes(s.email.toLowerCase())){res.status(401).json({error:"Authentication required"});return null;}return s;}
