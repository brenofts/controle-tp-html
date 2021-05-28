var buttonClicked
var counter = document.getElementById('counter')
var counterArray = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
var pin1 = document.getElementById('pin1')
var pin2 = document.getElementById('pin2')
var pin3 = document.getElementById('pin3')
var pin4 = document.getElementById('pin4')
var inputPassword = document.getElementById('password')
var inputMatricula = document.getElementById('inputMatricula')
var grid = document.getElementById('gridTPs')
var modal = document.getElementById('modal')
var loginCard = document.getElementById('loginCard')
var login = document.getElementById('login')
var tps = []

firebase
	.auth()
	.signInAnonymously()
	.then(() => {
		realtime.ref('tps').on('value', data => {
			tps = Object.values(data.val())
			grid.innerHTML = ''
			tps.map(tp => {
				var index = tps.indexOf(tp)
				var className
				var status = tp.status.status
				switch (status) {
					case 'Em uso':
						className = 'em-uso'
						break
					case 'Devolvido':
						className = 'devolvido'
						break
					case 'Bloqueado':
						className = 'bloqueado'
						break
					case 'Transporte':
						className = 'transporte'
						break
					default:
						break
				}
				var item = `<div id="${tp.tp}" onclick="verificarTP(${index})" class="grid-item ${className}">${tp.tp} </div>`
				grid.innerHTML += item
			})
			grid.classList.remove('hidden')
		})
	})
	.catch(e => console.warn(e.message))

function limparLogin() {
	pin1.value = ''
	pin2.value = ''
	pin3.value = ''
	pin4.value = ''
	inputMatricula.value = ''
	login.classList.add('hidden')
	modal.classList.add('hidden')
	inputPassword.classList.add('hidden')
	document.getElementById(buttonClicked).classList.remove('active-item')
	document.getElementById('idEmUso').innerText = ''
	document.getElementById('idEmUso').classList.add('hidden')
	// remove listeners : elem.replaceWith(elem.cloneNode(true))
}

function verificarTP(index) {
	var tp = tps[index].status
	buttonClicked = tp.tp
	document.getElementById(buttonClicked).classList.add('active-item')
	document.getElementById('numeroTP').innerText = tp.tp
	switch (tp.status) {
		case 'Em uso':
			document.getElementById('action').innerText = 'Devolver'
			document.getElementById('idEmUso').innerText = tp.id
			document.getElementById('idEmUso').classList.remove('hidden')
			console.warn('Devolver', tp.tp, tp.id)
			break
		case 'Devolvido':
			document.getElementById('action').innerText = 'Retirar'
			console.warn('Retirar', tp.tp)
			break
		default:
			document.getElementById('action').innerText = tp.status
			console.warn(tp.tp, tp.status)
			break
	}
	console.log(tp)
	setTimeout(() => {
		modal.classList.remove('hidden')
		login.classList.remove('hidden')
		inputMatricula.focus()
		// setTimeout(() => {
		// }, 100);
	}, 100)
	// setTimeout(() => {
	//   limparLogin()
	//   modal.classList.add('hidden')
	// }, 18 * 1000);
}

inputMatricula.addEventListener('input', e => {
	e.preventDefault()
	if (inputMatricula.value.length > 2) {
		inputPassword.classList.remove('hidden')
	} else {
		inputPassword.classList.add('hidden')
	}
	if (inputMatricula.value.length == 5) {
		pin1.focus()
	}
})

inputMatricula.addEventListener('keydown', e => {
	if (e.target.value.length > 2 && e.keyCode === 13) {
		pin1.focus()
	}
})

pin1.addEventListener('focus', e => {
	e.preventDefault()
	if (pin1.value.length == 1) {
		pin1.value = ''
	}
	e.target.addEventListener('keydown', press => {
		if (press.keyCode === 8) {
			inputMatricula.focus()
		}
	})
})

pin2.addEventListener('focus', e => {
	e.preventDefault()
	if (pin2.value.length == 1) {
		pin2.value = ''
	}
	e.target.addEventListener('keydown', press => {
		if (press.keyCode === 8) {
			pin1.focus()
		}
	})
})

pin3.addEventListener('focus', e => {
	e.preventDefault()
	if (pin3.value.length == 1) {
		pin3.value = ''
	}
	e.target.addEventListener('keydown', press => {
		if (press.keyCode === 8) {
			pin2.focus()
		}
	})
})

pin4.addEventListener('focus', e => {
	e.preventDefault()
	if (pin4.value.length == 1) {
		pin4.value = ''
	}
	e.target.addEventListener('keydown', press => {
		if (press.keyCode === 8) {
			pin3.focus()
		}
	})
})

pin1.addEventListener('input', e => {
	e.preventDefault()
	if (pin1.value.length == 1) {
		pin2.focus()
	}
})

pin2.addEventListener('input', e => {
	e.preventDefault()
	if (pin2.value.length == 1) {
		pin3.focus()
	}
})

pin3.addEventListener('input', e => {
	e.preventDefault()
	if (pin3.value.length == 1) {
		pin4.focus()
	}
})

pin4.addEventListener('input', e => {
	e.preventDefault()
	if (pin4.value.length == 1) {
		pin4.blur()
		setTimeout(() => {
			alert('Registro efetivado')
			limparLogin()
		}, 100)
	}
})

window.addEventListener('click', e => {
	e.preventDefault()
	if (e.target == modal) {
		modal.classList.add('hidden')
		limparLogin()
	}
})
