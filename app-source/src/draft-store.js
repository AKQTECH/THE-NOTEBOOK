import {blankState,mergeStates,validState,docText} from './model.js';
const PREFIX='akq_notebook_recovery_v1:';
// Revision-addressed records are immutable: no tab can overwrite another tab's draft.
// Compact only acknowledged ancestors after the shared snapshot is durably written.
export class DraftStore {
 constructor(storage){this.storage=storage;}
 entries(){const result=[];for(let i=0;i<this.storage.length;i++){const key=this.storage.key(i);if(key?.startsWith(PREFIX))result.push([key,JSON.parse(this.storage.getItem(key))]);}return result;}
 save(state){for(const note of state.notes){const key=PREFIX+'revision:'+note.id+':'+note.rev;if(!this.storage.getItem(key))this.storage.setItem(key,JSON.stringify(note));}}
 checkpoint(before,after){for(const note of before.notes){const next=after.notes.find(n=>n.id===note.id);if(next&&next.rev!==note.rev){const key=PREFIX+'checkpoint:'+note.id+':'+note.rev;if(!this.storage.getItem(key))this.storage.setItem(key,JSON.stringify(note));}}}
 compact(state){for(const [key,note] of this.entries()){
  if(!key.startsWith(PREFIX+'revision:'))continue;
  const next=state.notes.find(n=>n.id===note.id);
  // Keep text preceding a deletion or an emptied document as a recovery checkpoint.
  if(next&&next.rev!==note.rev&&(next.ancestors||[]).includes(note.rev)){
   if(next.deletedAt||(docText(note.doc).trim()&&!docText(next.doc).trim())){
    const checkpoint=PREFIX+'checkpoint:'+note.id+':'+note.rev;
    if(!this.storage.getItem(checkpoint))this.storage.setItem(checkpoint,JSON.stringify(note));
   }
   this.storage.removeItem(key);
  }
 }}
 exportState(){
  const unique=new Map();for(const [,note] of this.entries())unique.set(note.id+':'+note.rev,note);
  return {...blankState(),notes:[...unique.values()].map(note=>({...note,id:'recovery:'+note.id+':'+note.rev,title:(note.title||'Untitled note')+' — recovery copy',deletedAt:null,archivedAt:null,ancestors:[],conflictOf:undefined}))};
 }
 recover(state,protectedId=null){
  let result=state;
  for(const [,note] of this.entries()){
   const incoming=validState({...blankState(),notes:[note]});
   if(result.notes.some(n=>(n.id===note.id||n.conflictOf===note.id)&&(n.rev===note.rev||(n.ancestors||[]).includes(note.rev))))continue;
   result=mergeStates(result,incoming,protectedId);
  }
  return result;
 }
}
