import { Modal as ModalAntd } from 'antd'

import './Modal.scss'

const Modal = ({ modalTitle, isVisibleModal, setIsVisibleModal, width, children }) => {
    return (
        <ModalAntd
            title={modalTitle}
            centered
            visible={isVisibleModal}
            onCancel={() => setIsVisibleModal(false)}
            width={width}
        >
            {children}
        </ModalAntd>
    )
}

export default Modal