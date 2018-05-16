
const __TopIcon = () => {
    const top = e('.to-top')
    document.addEventListener('scroll', (event) => {
        let y = window.scrollY
        if (y > 500) {
            top.classList.add('top')
        } else {
            top.classList.remove('top')
        }
    })

    top.addEventListener('click', (event) => {
        document.body.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    })
}

__TopIcon()