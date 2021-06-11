var buttonClicked
var btnUltimos = document.getElementById('ultimos')
var ultimosCard = document.querySelector('.ultimos-card')
var ultimosList = document.getElementById('ultimos-list')
var pin1 = document.getElementById('pin1')
var pin2 = document.getElementById('pin2')
var pin3 = document.getElementById('pin3')
var pin4 = document.getElementById('pin4')
var inputPassword = document.getElementById('password')
var inputMatricula = document.getElementById('inputMatricula')
var grid = document.getElementById('gridTPs')
var modal = document.getElementById('modal')
var canvas = document.querySelector('.canvas')
var loginCard = document.getElementById('loginCard')
var login = document.getElementById('login')
var tps = []
var message = document.getElementById('message')
var inicio = document.getElementById('inicio')
var textMessage = document.getElementById('text-message')
var title = document.getElementById('title')
var legend = document.querySelector('.legend')
var loading = document.querySelector('.loading')
var plusSign = document.getElementById('plusContainer')
var vertical = document.querySelector('.vertical')
var horizontal = document.querySelector('.horizontal')
var activeMenu = false
var menu = document.querySelector('.menu')
var btnBusca = document.querySelector('#btn-busca')
var busca = document.querySelector('#busca')
var btnSenhas = document.querySelector('#btn-senhas')
var senhas = document.querySelector('#senhas')


document.addEventListener('DOMContentLoaded', () => {
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
				loading.classList.add('hidden')
				grid.classList.remove('hidden')
				document.querySelector('.legend').classList.remove('hidden')
			})
		})
		.catch(e => console.warn(e.message))
})


function limparLogin() {
	pin1.value = ''
	pin2.value = ''
	pin3.value = ''
	pin4.value = ''
	inputMatricula.value = ''
	document.body.style.overflow = 'scroll'
	document.querySelector('.down').style.opacity = 0
	toggleBackground()
	login.classList.add('hidden')
	loginCard.classList.remove('blur')
	modal.classList.add('hidden')
	inputPassword.classList.add('hidden')
	document.getElementById(buttonClicked).classList.remove('active-item')
	document.getElementById('idEmUso').innerText = ''
	document.getElementById('idEmUso').classList.add('hidden')
}

function verificarTP(index) {
	document.body.style.overflow = 'hidden'
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
	setTimeout(() => {
		modal.classList.remove('hidden')
		login.classList.remove('hidden')
		toggleBackground()
	}, 100)
	setTimeout(() => {
		inputMatricula.focus()
	}, 400);
}

function toggleBackground() {
	title.classList.toggle('blur')
	grid.classList.toggle('blur')
	legend.classList.toggle('blur')
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
			loginCard.classList.remove('disable')
			ultimosCard.classList.add('hidden')
			inputMatricula.focus()
		} else {
			modal.classList.add('hidden')
			limparLogin()
		}
	}
})

btnUltimos.addEventListener('click', () => {
	loginCard.classList.add('blur')
	loginCard.classList.add('disable')
	ultimosCard.classList.remove('hidden')
	ultimosList.innerHTML = ''
	realtime
		.ref('historico')
		.once('value')
		.then(snap => {
			const historico = Object.values(snap.val())
			var buscarTP = tp => tp.tp == buttonClicked
			var registros = historico.filter(buscarTP)
			var ultimosRegistros = registros.slice(Math.max(registros.length - 20, 0)).reverse()
			if (ultimosRegistros.length > 0) {
				ultimosRegistros.map(tp => {
					var data = new Date(tp.data).toLocaleString()
					var className
					var listItem
					switch (tp.status) {
						case 'Devolvido':
							className = 'item-devolvido'
							listItem = `
							<div class="item ${className}">
							<span>${tp.status}</span>
							<span>${tp.id}</span>
							<span>GERENTE/IT: ${tp.gerente}</span>
							<span>${data}</span>
							<span>${tp.posto}</span>
							</div>
						`
							break;
							case 'Em uso':
								className = 'item-em-uso'
								listItem = `
								<div class="item ${className}">
								<span>${tp.status}</span>
								<span>${tp.id}</span>
								<span>${data}</span>
								<span>${tp.posto}</span>
								</div>
							`
							break
					
						default:
							break;
					}
					ultimosList.innerHTML += listItem
				})
			} else {
				ultimosList.innerHTML = 'Não há registros'
			}
			if (ultimosRegistros.length > 4) {
				document.querySelector('.down').style.opacity = 1
			}
			const divList = ultimosList.children
			const lastDiv = divList[divList.length - 4]

			ultimosList.addEventListener('scroll', e => {
				if (e.target.scrollTop > 40) {
					document.querySelector('.up').style.opacity = 1
				} 
				else {
					document.querySelector('.up').style.opacity = 0
				}
				if (ultimosRegistros.length > 4) {
					if (e.target.scrollTop > lastDiv.offsetTop) {
						document.querySelector('.down').style.opacity = 0
					}
					if (e.target.scrollTop < lastDiv.offsetTop) {
						document.querySelector('.down').style.opacity = 1
					}
				}
			})
		})
})

plusSign.addEventListener('click', () => toggleMenu())
btnBusca.addEventListener('click', () => Navigate(busca))
btnSenhas.addEventListener('click', () => Navigate(senhas))
title.children[0].addEventListener('click', () => Navigate(inicio))


function toggleMenu() {
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: "smooth"
	})
	document.body.style.overflow = 'hidden'
	horizontal.classList.toggle('rotatex')
	vertical.classList.toggle('rotatey')
	grid.classList.toggle('blur')
	grid.classList.toggle('disable')
	legend.classList.toggle('blur')
	if (!activeMenu) {
		menu.style.animation = 'show-menu 0.5s'
		setTimeout(() => {
			menu.style.top = '45px'
		}, 400);
		activeMenu = true
	} else {
		menu.style.animation = 'hide-menu 0.5s'
		document.body.style.overflow = 'scroll'
		setTimeout(() => {
			menu.style.top = -100 + 'vh'
		}, 400);
		activeMenu = false
	}
}

var screens = Array.from(document.querySelector('.canvas').children)
var clear = () => screens.map(screen => screen.style.display = 'none')

function Navigate(screen) {
	activeMenu ? toggleMenu() : null
	clear()
	screen.style.display = 'flex'
}


// class Screen {
// 	constructor(element) {
// 		document.querySelector(element)
// 	}
// }