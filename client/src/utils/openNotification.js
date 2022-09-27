import { notification } from 'antd'

export const openNotification = (status, msg, duration) => {
    notification[status]({
        message: msg,
        placement: 'bottomRight',
        duration: duration ? duration : duration === 0 ? 0 : 4.5
    })
}