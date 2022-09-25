import formClassManager from './formClassManager'

export const minLength = (target, min) => {
    const { value, name } = target

    formClassManager(name, 'input', 'remove', null)
    formClassManager(name, 'wrapper', 'remove', null)

    if (value.length >= min) {
        formClassManager(name, 'input', 'add', 'success-input')
        formClassManager(name, 'wrapper', 'add', 'success-wrapper')
        return true
    } else {
        formClassManager(name, 'input', 'add', 'error-input')
        formClassManager(name, 'wrapper', 'add', 'error-wrapper')
        return false
    }
}