import {useState,useEffect,useMemo,useCallback} from 'react';
import {getNotifications} from './api'; 

const notificationTypes=['Event','Placement','Result'];
const typepririty={
    'Placement':1,
    'Result':2,
    'Event':3 
}

