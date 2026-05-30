import {sendLogApi} from './api/evaluationApi';

export function log(stack,level,pkg,mesage){
  const body={
    stack:stack.toLowerCase(),
    level:level.toLowerCase(),
    package:pkg.toLowerCase(),
    message:mesage,
  };
  sendLogApi(body).catch(()=>{});
}

export function logError(pkg,mesage){
  log('frontend','error',pkg,mesage);
}
