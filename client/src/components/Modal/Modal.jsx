import { Modal as ModalAntd } from 'antd'

import './Modal.scss'

const Modal = ({ modalTitle, isVisibleModal, setIsVisibleModal, children }) => {
    return (
        <ModalAntd
            title={modalTitle}
            centered
            visible={isVisibleModal}
            onCancel={() => setIsVisibleModal(false)}
            footer={false}
        >
            {children}
        </ModalAntd>
    )
}

export default Modal