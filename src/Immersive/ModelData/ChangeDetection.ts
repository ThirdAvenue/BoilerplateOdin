import { model } from '../Abstracts/models'

export async function findChangedObjectId(initialState: any, modifiedState: any){
    const idChanges: string[] = [];
    //If Id does not match, we have a new object
    if (initialState.id !== modifiedState.id) {
      return idChanges;
    }
    for (const key in modifiedState) {
        if (Array.isArray(modifiedState[key])) {
          for (const element of modifiedState[key]) {
            //console.log(typeof element);
          }
        } else {
          if(modifiedState.id && modifiedState.version){
            if (JSON.stringify(modifiedState) != JSON.stringify(initialState)) {
                idChanges.push(modifiedState.id)
                return true;
            }
          }
        }
      }
   
    return null;
  }
  