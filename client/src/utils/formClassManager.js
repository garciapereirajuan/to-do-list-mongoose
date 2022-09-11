const removeClassInAllElements = (typeElement, theClass) => {
    let inputsTag = []

    if (typeElement === 'input')
        inputsTag = document.querySelectorAll(typeElement)
    if (typeElement === 'wrapper')
        inputsTag = document.querySelectorAll('.ant-input-affix-wrapper')

    for (let i = 0; i < inputsTag.length; i++) {
        if (!theClass) {
        inputsTag[i].classList.remove('error-input')
        inputsTag[i].classList.remove('error-wrapper')
        inputsTag[i].classList.remove('success-input')
        inputsTag[i].classList.remove('success-wrapper')
        } else {
        inputsTag[i].classList.remove(theClass)
        }
    }
}
  
const removeAllClasses = (element) => {
    element.classList.remove('error-input')
    element.classList.remove('error-wrapper')
    element.classList.remove('success-input')
    element.classList.remove('success-wrapper')
}
  
const formClassManager = (classElement, typeElement, action, theClass) => {
    let element = document.querySelectorAll(`.${classElement}`)[0]
  
    if (!typeElement) {
      console.log("Falta agregar el 'typeElement'...")
    } else if (!classElement) {
      console.log("Falta agregar el 'classElement'...")
    } else if (!action) {
      console.log("Falta agregar el 'action'...")
    } else if (classElement !== 'all') {
      if (typeElement === 'wrapper') {
        element = element.querySelectorAll('.ant-input-affix-wrapper')[0]
      }
      if (typeElement === 'input') {
        element = element.querySelectorAll('input')[0]
      }
      if (action === 'add') {
        element.classList.add(theClass)
      }
      if (action === 'remove') {
        if (theClass) {
          element.classList.remove(theClass)
        }
        if (!theClass) {
          removeAllClasses(element)
        }
      }
    } else if (classElement === 'all') {
      if (action === 'add') {
        console.log(
          "Si 'classElement' es 'all', entonces 'action' debe ser 'remove'",
        )
      }
      if (action === 'remove') {
        if (classElement === 'all' && theClass) {
          removeClassInAllElements(typeElement, theClass)
        } else if (classElement === 'all' && !theClass) {
          removeClassInAllElements(typeElement, null)
        }
      }
    }
}
  
  export default formClassManager
  