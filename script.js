var buttonClicked
var ultimos = document.getElementById('ultimos')
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
var message = document.getElementById('message')
var textMessage = document.getElementById('text-message')
var title = document.querySelector('.title')
var legend = document.querySelector('.legend')

firebase
	.auth()
	.signInAnonymously()
	.then(() => {
		realtime.ref('tps').on('value', snapshot => {
			tps = Object.values(snapshot.val())
			grid.innerHTML = ''
			tps.map(tp => {
				var index = tps.indexOf(tp)
				var className
				var status = tp.status.status
				var data = new Date(tp.status.data).getTime()
				var agora = new Date().getTime()
				var periodoEmMS = agora - data
				var umDiaEmMS = 1000 * 60 * 60 * 24
				var dias = Math.floor(periodoEmMS / umDiaEmMS)
				switch (status) {
					case 'Em uso':
						if (dias == 0 || dias == 1) {
							className = 'green'
						} else if (dias == 2 || dias == 3) {
							className = 'yellow'
						} else if (dias > 3) {
							className = 'red'
						}
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
			document.querySelector('.legend').classList.remove('hidden')
		})
	})
	.catch(e => console.warn(e.message))

function limparLogin() {
	pin1.value = ''
	pin2.value = ''
	pin3.value = ''
	pin4.value = ''
	inputMatricula.value = ''
	toggleBackground()
	login.classList.add('hidden')
	loginCard.classList.remove('blur')
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
		toggleBackground()
		inputMatricula.focus()
		// setTimeout(() => {
		// }, 100);
	}, 100)
	// setTimeout(() => {
	//   limparLogin()
	//   modal.classList.add('hidden')
	// }, 18 * 1000);
}

function toggleBackground() {
	if (legend.classList.contains('blur')) {
		title.classList.remove('blur')
		grid.classList.remove('blur')
		legend.classList.remove('blur')
	} else {
		title.classList.add('blur')
		grid.classList.add('blur')
		legend.classList.add('blur')
	}
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
			// message.style.display = 'flex'
			// modal.style.display = 'none'
			alert('Registro efetivado')
			limparLogin()
		}, 100)
	}
})

// modal.addEventListener('click', e => {
// 	e.preventDefault()
// 	modal.classList.add('hidden')
// 	limparLogin()
// })

window.addEventListener('click', e => {
	e.preventDefault()
	if (e.target == modal) {
		if (loginCard.classList.contains('blur')) {
			loginCard.classList.remove('blur')
		}
		else {
			modal.classList.add('hidden')
			limparLogin()
		}
	}
})

ultimos.addEventListener('click', () => {
	loginCard.classList.add('blur')
})
