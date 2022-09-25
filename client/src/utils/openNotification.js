import { notification } from 'antd'

export const openNotification = (status, msg, duration) => {
    notification[status]({
        message: msg,
        placement: 'bottomRight',
        duration: duration || 4.5
    })
}