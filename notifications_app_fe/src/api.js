const bsurl='http://4.224.186.213/evaluation-service';

const evaluationapi=axios.create({
    baseURL:bsurl,
    headers:{'Content-Type':'application/json'}
})
evaluationapi.interceptors.request.use(config=>{
    const token=localStorage.getItem('token');
    if(token&&token!=='null'&&token!=='undefined'){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});

export const getNotifications=(params={})=>
    evaluationapi.get('/notifications',{params});