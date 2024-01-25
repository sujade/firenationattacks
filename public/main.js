const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

deleteButton.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Zuko'
        })
    })
        .then(response => response.json())
        .then(response => {
            if (response === 'Zuko is already pretty silent.') {
                messageDiv.textContent = "Zuko's search came to a halt."
            } else {
                window.location.reload()
            }
        })
        .catch(error => console.error(error))
})