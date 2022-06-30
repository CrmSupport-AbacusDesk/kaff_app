import React, { createContext, useReducer } from 'react';
import createDataContext from './createDataContext';

const initialState = {
    qrId: null,
    qrCode: null,
    qrAmount: null
}

const QrReducer = (state, action) => {
    switch (action.type) {
        case 'add_qr':
            console.log('Inside Context');
            return {
                ...state,
                id: Math.floor(Math.random() * 99999),
                qrCode: action.paramQrCode,
                qrAmount: action.paramAmount
            }; 
        case 'get_qr':
            return state;
    }
}

const addQrCode = (dispatch) => {
    return (paramQrCode, paramAmount) => {
        dispatch({ type: 'add_qr', qrId:paramQrId, qrCode:paramQrCode, qrAmount:paramAmount })
    }
}

const getQr = (dispatch) => {
    return () => {
        dispatch({ type: 'get_qr'})
    }
}

export const { Context, Provider } = createDataContext(QrReducer,
    {
        addQrCode,
        getQr
    }, []);