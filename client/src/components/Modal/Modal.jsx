import { Modal as ModalAntd } from 'antd'

import './Modal.scss'

const Modal = (props) => {
    const {
        modalTitle, isVisibleModal, setIsVisibleModal,
        setReloadCategories, setReloadTasks, width, children
    } = props

    const onCancel = () => {
        setReloadCategories && setReloadCategories(true)
        setReloadTasks && setReloadTasks(true)
        setIsVisibleModal && setIsVisibleModal(false)
    }

    return (
        <ModalAntd
            title={modalTitle}
            centered
            visible={isVisibleModal}
            onCancel={onCancel}
            footer={false}
            width={width}
        >
            {children}
        </ModalAntd>
    )
}

export default Modal