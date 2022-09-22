import { Modal as ModalAntd } from 'antd'

import './Modal.scss'

const Modal = (props) => {
    const { modalTitle, isVisibleModal, setIsVisibleModal, width, children } = props

    return (
        <ModalAntd
            title={modalTitle}
            centered
            visible={isVisibleModal}
            onCancel={() => setIsVisibleModal(false)}
            footer={false}
            width={width}
        >
            {children}
        </ModalAntd>
    )
}

export default Modal