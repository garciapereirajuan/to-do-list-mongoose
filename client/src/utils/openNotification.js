import { notification } from 'antd'

export const openNotification = (status, msg) => {
    notification[status]({
        message: msg,
        placement: 'bottomRight'
    })
}