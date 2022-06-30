import React, {createContext, useReducer} from 'react';

const QrContext = createContext();

const QrReducer = (state, action) => {
    switch (action.type) {
        case 'add_QrCode':
            return [...state,
                {
                    qrId: Math.floor(Math.random() * 99999),
                    qrCode: action.qrCode,
                    qrAmount: action.qrAmount
                }]
        case 'delete_QrCode':
            return state.filter((qrObj) => qrObj.qrId !== action.qrId)
        default:
            return state;
    }
}

export const QrProvider = ({ children }) => {
    const initialState = [{
        qrId: '-1',
        qrCode: '',
        qrAmount: 0
    }]

    const [GlobalQR, dispatch] = useReducer(QrReducer, initialState);

    const addQrCode = (qrCode, qrAmount) => {
        console.log('--- Inside QrContext -----');
        console.log(qrCode, qrAmount);
        dispatch({
            type: 'add_QrCode',
            qrCode: qrCode,
            qrAmount: qrAmount
        });
    }

    const deleteQrCode = (qrId) => {
        console.log('>>>>> INSIDE DELETE FUNCTION <<<<<<<');
        console.log(qrId);
        dispatch({
            type: 'delete_QrCode',
            qrId:qrId
        });
    }


    return <QrContext.Provider value={
        {
            GlobalQrData:GlobalQR,
            addQrCode,
            deleteQrCode
        }}>
        {children}
    </QrContext.Provider>
}

export default QrContext;