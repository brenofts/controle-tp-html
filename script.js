if (new Date().getTimezoneOffset() !== 180) {
	alerta('Verifique as configurações de fuso horário.')
	reload()
}

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
var btnInicio = document.getElementById('btn-inicio')
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
var btnControle = document.querySelector('#btn-controle')
var controle = document.querySelector('#controle')
var tabelaControle = document.querySelector('#tabela-controle')
var tabelaHistorico = document.querySelector('#tabela-historico')
var updateTime = document.querySelector('.update-time')
var main = document.querySelector('.main')
var element = id => document.getElementById(id)

const reload = () => document.location.reload()
var diferencaHora

const ajustarHora = () => {
	return new Promise((resolve, reject) => {
		if (new Date().getTimezoneOffset() == 180) {
			realtime.ref('.info/serverTimeOffset').once('value', snap => {
				diferencaHora = snap.val()
			})
			resolve(diferencaHora)
		} else {
			reject('Verifique as configurações de fuso horário.')
		}
	})
}


// e-mail

var id, mensagem, email, chave, emailPiloto, emailGerente
var url_mail = 'https://script.google.com/macros/s/AKfycbzxOSF9HlUU_urUxS2LT2Poi7pEa30Ij1E_sZkxeAyR6MEvc_JuFkBqRFeVyBtfBrkELQ/exec'
var url =
	'https://script.google.com/macros/s/AKfycbzxAB1XqFHuYHdF4ybeCeG4wMdjw_NUl5G_tw1d_mFTyFjik346tqQ59Sx4nWNRpKrM5Q/exec'
var fetchUrl
// var fetchUrl = url + '?mensagem=' + mensagem + '&email=' + email + '&chave=' + chave
var header = {
	method: 'POST',
	mode: 'no-cors',
}



function updateGrid() {
	title.classList.add('disable')
	firebase
		.auth()
		.signInAnonymously()
		.then(() => {
			realtime.ref('tps').on('value', snapshot => {
				tps = Object.values(snapshot.val())
				realtime
					.ref('.info/serverTimeOffset')
					.once('value', snap => (diferencaHora = snap.val()))
					.then(() => {
						updateTime.innerHTML = 'Atualizado em ' + new Date(new Date().getTime() + diferencaHora).toLocaleString()
					})
					.catch(e => alert(e.message))
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
						// case 'Bloqueado':
						// 	className = 'bloqueado'
						// 	break
						// case 'Transporte':
						// 	className = 'transporte'
						// 	break
						default:
							break
					}
					var item = `<div id="${tp.tp}" onclick="verificarTP(${index})" class="grid-item ${className}">${tp.tp} </div>`
					grid.innerHTML += item
				})
				loading.classList.add('hidden')
				grid.classList.remove('hidden')
				title.classList.remove('disable')
				document.querySelector('.legend').classList.remove('hidden')
			})
		})
		.catch(e => console.warn(e.message))
}

document.addEventListener('DOMContentLoaded', updateGrid)

btnInicio.addEventListener('click', updateGrid)

function limparLogin() {
	pin1.value = ''
	pin2.value = ''
	pin3.value = ''
	pin4.value = ''
	inputMatricula.value = ''
	document.body.style.overflow = 'scroll'
	document.querySelector('.down').style.opacity = 0
	//toggleBackground()
	login.classList.add('hidden')
	loginCard.classList.remove('blur')
	modal.classList.add('hidden')
	inputPassword.classList.add('hidden')
	document.getElementById(buttonClicked).classList.remove('active-item')
	document.getElementById('idEmUso').innerText = ''
	document.getElementById('idEmUso').classList.add('hidden')
}

function cancel() {
	limparLogin()
	alerta('O registro foi cancelado pois houve um registro para o mesmo TP em outro posto', null, true)
}

function verificarTP(index) {
	document.body.style.overflow = 'hidden'
	var tp = tps[index].status
	buttonClicked = tp.tp
	realtime.ref('tps/' + tp.tp).on('child_changed', cancel)
	document.getElementById(buttonClicked).classList.add('active-item')
	document.getElementById('numeroTP').innerText = tp.tp
	switch (tp.status) {
		case 'Em uso':
			tipoRegistro = 2
			tpDevolver = tp.tp
			matricula = tp.matricula
			emailPiloto = tp.email
			document.getElementById('action').innerText = 'Devolver'
			document.getElementById('idEmUso').innerText = tp.id
			element('inputMatricula').setAttribute('placeholder', 'Gerente/IT')
			id = tp.id
			document.getElementById('idEmUso').classList.remove('hidden')
			console.warn('Devolver', tp.tp, tp.id)
			break
		case 'Devolvido':
			tipoRegistro = 1
			tpRetirar = tp.tp
			document.getElementById('action').innerText = 'Retirar'
			element('inputMatricula').setAttribute('placeholder', 'Matrícula')
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
		//toggleBackground()
	}, 100)
	setTimeout(() => {
		inputMatricula.focus()
	}, 400)
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

function limparPin() {
	pin1.value = ''
	pin2.value = ''
	pin3.value = ''
	pin4.value = ''
	pin1.focus()
}

pin1.addEventListener('focus', e => {
	e.preventDefault()
	if (tipoRegistro == 1) {
		matricula = inputMatricula.value
	}
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
		pin = pin1.value.toString() + pin2.value.toString() + pin3.value.toString() + pin4.value.toString()
		switch (tipoRegistro) {
			case 1:
				verificarUsuario()
				break
			case 2:
				verificarGerente()
				break

			default:
				break
		}
		setTimeout(() => {
			realtime.ref('tps/' + buttonClicked).off('child_changed', cancel)
		}, 100)
	}
})

var tipoRegistro, tpRetirar, tpDevolver, matricula, gerente, matricula_gerente, nome
var posto = 'T-PAS'

function verificarUsuario() {
	registrando()
	realtime
		.ref('usuarios')
		.once('value')
		.then(snap => {
			var usuarios = Object.values(snap.val())
			var encontrarUsuario = i => i.matricula == matricula
			var usuarioEncontrado = usuarios.find(encontrarUsuario)
			if (usuarioEncontrado != undefined) {
				if (usuarioEncontrado.p == pin * 1993) {
					if (usuarioEncontrado.livre) {
						id = usuarioEncontrado.id
						emailPiloto = usuarioEncontrado.email
						ajustarHora().then(() => retirar())
					} else {
						document.querySelector('body').classList.remove('disable')
						document.querySelector('.registrando').classList.add('hidden')
						alerta('Consta TP ' + usuarioEncontrado.tp + ' em nome de ' + usuarioEncontrado.id, limparLogin)
					}
				} else {
					registrando()
					alerta('Senha incorreta', limparPin)
				}
			} else {
				registrando()
				alerta('Matrícula ' + matricula + ' não encontrada', function () {
					limparPin()
					inputPassword.classList.add('hidden')
					matricula = undefined
					inputMatricula.value = ''
					inputMatricula.focus()
				})
			}
		})
		.catch(e => alerta(e.message, null, true))
}

function retirar() {
	chave = realtime.ref().child('historico').push().key

	var registro = {
		status: 'Em uso',
		id: id,
		matricula: matricula,
		matricula_gerente: '-',
		tp: tpRetirar,
		posto: 'T-PAS',
		gerente: '-',
		data: new Date().getTime() + diferencaHora,
		key: chave,
		email: emailPiloto,
	}

	var updates = {}
	updates['/tps/' + tpRetirar + '/status/'] = registro
	updates['/historico/' + chave] = registro
	updates['/usuarios/' + emailPiloto.split('@')[0].replace('.', '_') + '/livre/'] = false
	updates['/usuarios/' + emailPiloto.split('@')[0].replace('.', '_') + '/tp/'] = tpRetirar

	var msgAlert =
		tpRetirar +
		' retirado por ' +
		id +
		' em ' +
		posto +
		'\n \n' +
		new Date(registro.data).toLocaleString() +
		'\n \n' +
		'Registro ' +
		chave

	var dia_hora = new Date(registro.data).toLocaleString().split(' ')
	var dia = dia_hora[0]
	var hora = dia_hora[1]
	
	mensagem =
		'TP ' + tpRetirar + ' retirado por ' + id + ' em ' + posto + '<br>' + new Date(registro.data).toLocaleString()
	email = emailPiloto
	fetchUrl = url + '?mensagem=' + mensagem + '&email=' + email + '&chave=' + chave + '&data=' + dia + '&hora=' + hora + '&posto=' + posto + '&tp=' + tpRetirar + '&piloto=' + id + '&gerente=-' + '&status=EM USO' 

	// retorna chamando o firebase para escrever as atualizacoes
	return realtime
		.ref()
		.update(updates)
		.then(
			fetch(encodeURI(fetchUrl), header)
				.then(response => {
					console.log(response)
				})
				.catch(e => alerta('Erro ao enviar e-mail: ' + e, null, true))
		)
		.then(() => {
			registroFim(msgAlert, 6)
		})
		.catch(e => {
			return alerta(e.message)
		})
}

function verificarGerente() {
	registrando()
	realtime
		.ref('usuarios')
		.once('value')
		.then(snap => {
			var usuarios = Object.values(snap.val())
			var encontrarGerente = i => i.matricula == inputMatricula.value
			var gerenteEncontrado = usuarios.find(encontrarGerente)
			if (gerenteEncontrado != undefined) {
				if (pin == gerenteEncontrado.p / 1993) {
					if (gerenteEncontrado.gerente) {
						gerente = gerenteEncontrado.id
						emailGerente = gerenteEncontrado.email
						matricula_gerente = gerenteEncontrado.matricula
						devolver()
					} else {
						document.querySelector('body').classList.remove('disable')
						document.querySelector('.registrando').classList.add('hidden')
						alerta('Autorizado somente para Gerentes / IT', limparLogin)
					}
				} else {
					registrando()
					alerta('Senha incorreta', limparPin)
				}
			} else {
				registrando()
				alerta('Matrícula ' + inputMatricula.value + ' não encontrada', function () {
					limparPin()
					inputPassword.classList.add('hidden')
					matricula = undefined
					inputMatricula.value = ''
					inputMatricula.focus()
				})
			}
		})
		.catch(e => alerta(e.message, null, true))
}

function devolver() {
	chave = realtime.ref().child('historico').push().key

	var registro = {
		status: 'Devolvido',
		id: id,
		matricula: matricula,
		matricula_gerente: matricula_gerente,
		tp: tpDevolver,
		posto: 'T-PAS',
		gerente: gerente,
		data: new Date().getTime() + diferencaHora,
		key: chave,
	}

	var updates = {}
	updates['/tps/' + tpDevolver + '/status/'] = registro
	updates['/historico/' + chave] = registro
	updates['/usuarios/' + emailPiloto.split('@')[0].replace('.', '_') + '/livre/'] = true
	updates['/usuarios/' + emailPiloto.split('@')[0].replace('.', '_') + '/tp/'] = '-'

	var dia_hora = new Date(registro.data).toLocaleString().split(' ')
	var dia = dia_hora[0]
	var hora = dia_hora[1]

	var msgAlert =
		tpDevolver +
		' devolvido por ' +
		id +
		' para ' +
		gerente +
		' em ' +
		posto +
		'\n \n' +
		new Date(registro.data).toLocaleString() +
		'\n \n' +
		'Registro ' +
		chave

	mensagem =
		'TP ' +
		tpDevolver +
		' devolvido por ' +
		id +
		' para ' +
		gerente +
		' em ' +
		posto +
		'<br>' +
		new Date(registro.data).toLocaleString()
	email = emailPiloto + ',' + emailGerente
	fetchUrl = url + '?mensagem=' + mensagem + '&email=' + email + '&chave=' + chave + '&data=' + dia + '&hora=' + hora + '&posto=' + posto + '&tp=' + tpDevolver + '&piloto=' + id + '&gerente='+ gerente + '&status=DEVOLVIDO' 

	// retorna chamando o firebase para escrever as atualizacoes e enviar e-mail
	return realtime
		.ref()
		.update(updates)
		.then(
			fetch(encodeURI(fetchUrl), header)
				.then(response => {
					console.log(response)
				})
				.catch(e => alerta('Erro ao enviar e-mail: ' + e, null, true))
		)
		.then(() => {
			registroFim(msgAlert, 4)
		})
		.catch(e => {
			return alerta(e.message)
		})
}

function registrando() {
	document.querySelector('body').classList.toggle('disable')
	loginCard.classList.toggle('blur')
	document.querySelector('.registrando').classList.toggle('hidden')
}

function registroFim(texto, tempo) {
	document.querySelector('.registrando').classList.toggle('hidden')
	document.querySelector('.text-message').innerText = texto
	document.querySelector('.message').style.display = 'flex'
	setTimeout(() => {
		updateGrid()
		document.querySelector('.message').style.animation = 'hideMessage .6s ease'
		main.classList.remove('disable')
		setTimeout(() => {
			limparLogin()
			document.querySelector('.message').style.display = 'none'
			document.querySelector('.message').style.animation = 'showMessage .6s ease'
			document.querySelector('body').classList.toggle('disable')
		}, 500)
	}, tempo * 1000)
	id, tpRetirar, tpDevolver, (matricula = undefined)
}

window.addEventListener('click', e => {
	if (e.target == modal) {
		if (loginCard.classList.contains('blur')) {
			loginCard.classList.remove('blur')
			loginCard.classList.remove('disable')
			ultimosCard.classList.add('hidden')
			inputMatricula.focus()
		} else {
			realtime.ref('tps/' + buttonClicked).off('child_changed', cancel)
			modal.classList.add('hidden')
			limparLogin()
		}
	}
})

btnUltimos.addEventListener('click', e => {
	e.preventDefault()
	loginCard.classList.add('blur', 'disable')
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
						case 'Transporte':
						case 'Bloqueado':
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
							break
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
							break
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
				if (e.target.scrollTop > 60) {
					document.querySelector('.up').style.opacity = 1
				} else {
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
			ultimosCard.classList.remove('hidden')
			ultimosList.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth',
			})
		})
})

// var x = 58601

// while (x <= 58605) {
// 	realtime.ref('tps/' + x + '/obs_controle').set('* Sem observações')
// 	x++
// }

var obsPre

function lerObs(numTP) {
	element('legend-controle').classList.add('hidden')
	element('div-obs').classList.remove('hidden')
	main.classList.add('hidden')
	realtime
		.ref('tps/')
		.once('value')
		.then(snap => {
			var resultado = Object.values(snap.val())
			var tpEncontrado = resultado.find(i => i.tp == numTP)
			obsPre = tpEncontrado.obs_controle
			element('text-obs').value = tpEncontrado.obs_controle
		})
	element('num-tp-obs').innerText = numTP
	element('text-nova-obs').focus()
}

var escrever = new Boolean()

function abrirLogin(action) {
	element('text-nova-obs').setAttribute('readonly', true)
	element('div-login-obs').classList.remove('hidden')
	element('input-matricula-obs').focus()
	element('input-matricula-obs').setAttribute('placeholder', 'Matrícula')
	switch (action) {
		case 'escrever':
			if (element('text-nova-obs').value != '') {
				escrever = true
			} else {
				element('div-login-obs').classList.add('hidden')
				element('text-nova-obs').removeAttribute('readonly')
				element('text-nova-obs').focus()
			}
			break
		case 'limpar':
			escrever = false
			element('input-matricula-obs').setAttribute('placeholder', 'Gerente/IT')
			break

		default:
			break
	}
}

element('input-matricula-obs').addEventListener('input', e => {
	if (e.target.value.length == 5) {
		element('input-senha-obs').focus()
	}
})

element('input-senha-obs').addEventListener('focus', () => {
	if (element('input-matricula-obs').value.length <= 2) {
		element('input-matricula-obs').focus()
	}
})

function escreverObs(usuario) {
	var text
	if (obsPre.includes('*')) {
		text =
			'[' +
			new Date().toLocaleString() +
			' - ' +
			usuario.id +
			' - ' +
			posto +
			' | ' +
			element('text-nova-obs').value.toUpperCase() +
			']'
	} else {
		text =
			'[' +
			new Date().toLocaleString() +
			' - ' +
			usuario.id +
			' - ' +
			posto +
			' | ' +
			element('text-nova-obs').value.toUpperCase() +
			']\n' +
			obsPre
	}
	
		realtime
			.ref('tps/' + element('num-tp-obs').innerText + '/obs_controle')
			.set(text)
			.then(() => alerta('Observação registrada com sucesso', fecharObs))
	
}

function limparObs(usuario) {
	var chave = realtime.ref('obs_historico').push().key
	var numTP = element('num-tp-obs').innerText
	var text = '* Observações apagadas em ' + new Date().toLocaleString() + ' | ' + usuario.id + ' - ' + posto
	var obs_historico = {}
	obs_historico['tp'] = numTP
	obs_historico['obs_apagadas'] = obsPre
	obs_historico['registro'] = text
	var updates = {}
	updates['obs_historico/' + chave] = obs_historico
	updates['tps/' + element('num-tp-obs').innerText + '/obs_controle'] = text
	realtime
		.ref()
		.update(updates)
		.then(() => alerta('Observações apagadas com sucesso', fecharObs))
}

element('input-senha-obs').addEventListener('input', e => {
	if (e.target.value.length == 4) {
		e.target.blur()
		var matricula = element('input-matricula-obs').value
		var pin = e.target.value
		loginObs(matricula, pin)
			.then(usuario => {
				if (escrever) {
					escreverObs(usuario)
				} else {
					if(usuario.gerente) {
						limparObs(usuario)
					} else {
						alerta('Autorizado somente para IT/Gerente', function () {
							element('input-senha-obs').value = ''
							element('input-matricula-obs').value = ''
							element('input-matricula-obs').focus()
						})
					}
				}
			})
			.catch(e => {
				if (e.code == 01) {
					alerta(e.message, function () {
						element('input-senha-obs').value = ''
						element('input-senha-obs').focus()
					})
				} else {
					if (e.code == 00) {
						alerta(e.message, function () {
							element('input-senha-obs').value = ''
							element('input-matricula-obs').focus()
						})
					}
				}
			})
	}
})

function loginObs(matricula, pin) {
	return new Promise((res, rej) => {
		realtime
			.ref('usuarios')
			.once('value')
			.then(snap => {
				var usuarios = Object.values(snap.val())
				var encontrar_usuario = i => i.matricula == matricula
				var usuario_encontrado = usuarios.find(encontrar_usuario)
				if (usuario_encontrado != undefined) {
					if (usuario_encontrado.p == pin * 1993) {
						res(usuario_encontrado)
					} else {
						var err = {
							code: 01,
							message: 'Senha incorreta',
						}
						rej(err)
					}
				} else {
					var err = {
						code: 00,
						message: 'Matrícula ' + matricula + ' não encontrada',
					}
					rej(err)
				}
			})
	})
}

function removeListeners(id) {
	return new Promise(res => {
		var element = document.getElementById(id)
		var new_element = element.cloneNode(true)
		element.parentNode.replaceChild(new_element, element)
		res(new_element)
	})
}

function fecharObs() {
	element('input-matricula-obs').value = ''
	element('input-senha-obs').value = ''
	element('text-nova-obs').value = ''
	element('legend-controle').classList.remove('hidden')
	element('text-nova-obs').removeAttribute('readonly')
	element('div-login-obs').classList.add('hidden')
	main.classList.remove('hidden')
	setTimeout(() => {
		element('div-obs').classList.add('hidden')
	}, 100);
}

// MENU
plusSign.addEventListener('click', () => toggleMenu())
btnBusca.addEventListener('click', () => Navigate(busca))
btnSenhas.addEventListener('click', () => Navigate(senhas))
btnControle.addEventListener('click', () => {
	Navigate(controle)
	ajustarHora()
		.then(() => {
			realtime.ref('tps').on('value', snap => {
				const tps = Object.values(snap.val())
				updateTime.innerHTML = 'Atualizado em ' + new Date(new Date().getTime() + diferencaHora).toLocaleString()
				tabelaControle.innerHTML = ''
				tps.map(tp => {
					var status = tp.status.status
					if (!tp.obs_controle.includes('*')) {
						obsTP = 'obs-controle'
					}
					var hoje = new Date().getTime()
					var evento = new Date(tp.status.data).getTime()
					var diferencaEmMs = hoje - evento
					var umDiaEmMs = 1000 * 3600 * 24
					var dias = Math.floor(diferencaEmMs / umDiaEmMs)
					var className, obsTP
					switch (status) {
						case 'Em uso':
							if (dias == 0 || dias == 1) {
								className = 'tr-green'
							} else if (dias == 2 || dias == 3) {
								className = 'tr-yellow'
							} else if (dias > 3) {
								className = 'tr-red'
							}
							break
						case 'Devolvido':
							className = 'tr-devolvido'
							break
						case 'Bloqueado':
							className = 'tr-bloqueado'
							break
						case 'Transporte':
							className = 'tr-transporte'
							break
						default:
							break
					}
					var tr = `
					<div class="${obsTP}" ></div>
					<tr class="${className}" onclick="lerObs(${tp.tp})">
					<td><strong>${tp.tp}</strong></td>
					<td>${tp.status.status}</td>
					<td>${dias}</td>
					<td>${new Date(tp.status.data).toLocaleDateString()}</td>
					<td>${new Date(tp.status.data).toLocaleTimeString()}</td>
					<td>${tp.status.id}</td>
					<td>${tp.status.gerente}</td>
					<td>${tp.status.posto}</td>
					<div class="add-obs"></div>
					</tr>
				`
					tabelaControle.innerHTML += tr
				})
			})
		})
		.catch(e => alerta(e.message, null, true))
})

title.children[0].addEventListener('click', () => Navigate(inicio))

function toggleMenu() {
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: 'smooth',
	})
	document.body.style.overflow = 'hidden'
	horizontal.classList.toggle('rotatex')
	vertical.classList.toggle('rotatey')
	//canvas.classList.toggle('blur')
	canvas.classList.toggle('disable')
	if (!activeMenu) {
		menu.style.animation = 'show-menu 0.5s'
		setTimeout(() => {
			menu.style.top = '45px'
		}, 400)
		activeMenu = true
	} else {
		menu.style.animation = 'hide-menu 0.5s'
		document.body.style.overflow = 'scroll'
		setTimeout(() => {
			menu.style.top = -100 + 'vh'
		}, 400)
		activeMenu = false
	}
}

function Navigate(screen) {
	activeMenu ? toggleMenu() : null
	var screens = Array.from(document.querySelectorAll('.screen'))
	screens.map(screen => (screen.style.display = 'none'))
	screen.style.display = 'flex'
	if (screen != inicio) {
		btnInicio.innerText = '⟪ Início'
	} else {
		btnInicio.innerText = 'Controle de TPs'
	}
	if (screen != inicio && screen != controle) {
		updateTime.classList.add('hidden')
	} else {
		updateTime.classList.remove('hidden')
	}
	limparBusca()
}

var buscaTodos = document.querySelector('.busca-todos')
var buscaData = document.querySelector('.busca-data')
var buscaMatricula = document.querySelector('.busca-matricula')
var buscaGerente = document.querySelector('.busca-gerente')
var buscaTP = document.querySelector('.busca-tp')

function abrirBusca(tipo, botao) {
	var buscas = Array.from(document.querySelector('.canvas-busca').children)
	buscas.map(busca => (busca.style.display = 'none'))
	tipo.style.display = 'flex'
	limparBusca()
	var botoesBusca = Array.from(document.querySelectorAll('.btn-b'))
	botoesBusca.map(i => i.classList.remove('btn-b-active'))
	botao.classList.add('btn-b-active')
}

function limparBusca() {
	tabelaMatricula.classList.add('hidden')
	tabelaGerente.classList.add('hidden')
	element('input-matricula-buscar').value = ''
	element('input-gerente-buscar').value = ''
	element('data-inicial').value = ''
	element('data-final').value = ''
}

function alerta(texto, action = null, r = false) {
	document.querySelector('.text-message').innerText = texto
	document.querySelector('.message').style.display = 'flex'
	main.classList.add('disable')
	if (r) {
		setTimeout(() => {
			document.querySelector('.message').style.animation = 'hideMessage .6s ease'
			setTimeout(() => {
				reload()
			}, 100)
		}, 5000)
	} else {
		setTimeout(() => {
			document.querySelector('.message').style.animation = 'hideMessage .6s ease'
			// canvas.classList.toggle('disable')
			// title.classList.toggle('disable')
			main.classList.remove('disable')
			setTimeout(() => {
				document.querySelector('.message').style.display = 'none'
				document.querySelector('.message').style.animation = 'showMessage .6s ease'
				action()
			}, 500)
		}, 5000)
	}
}

// BUSCA POR TP

var gridTPBusca = document.querySelector('.grid-tp-busca')
var tabelaTP = document.getElementById('tabela-tp')

function buscarTP(numTP) {
	gridTPBusca.classList.add('hidden')
	tabelaTP.classList.add('hidden')
	document.querySelector('.processando2').classList.remove('hidden')
	tabelaTP.children[2].innerHTML = ''
	realtime
		.ref('historico')
		.once('value')
		.then(snap => {
			var historico = Object.values(snap.val())
			var encontrar = i => i.tp == numTP
			var resultado = historico.reverse().filter(encontrar)
			if (resultado.length > 0) {
				ajustarHora().then(() => {
					var hora = new Date(new Date().getTime() + diferencaHora).toLocaleString()
					var resumoBusca = resultado.length + ' registros para o TP ' + numTP
					var horaDaBusca = `<br> Busca realizada em ${hora}`
					tabelaTP.children[0].innerHTML = resumoBusca
					tabelaTP.children[0].innerHTML += horaDaBusca
					// var hora = new Date(new Date().getTime() + diferencaHora).toLocaleString()
					// var horaDaBusca = `Busca realizada em ${hora} <br> ${resultado.length} registros`
					// tabelaTP.children[0].innerHTML = horaDaBusca
				})
				resultado.map(registro => {
					var tr = `
				<tr class='tr-devolvido'>
				<td><strong>${registro.tp}</strong></td>
				<td>${registro.status}</td>
				<td>${new Date(registro.data).toLocaleDateString()}</td>
				<td>${new Date(registro.data).toLocaleTimeString()}</td>
				<td>${registro.id}</td>
				<td>${registro.gerente}</td>
				<td>${registro.posto}</td>
				</tr>
				`
					tabelaTP.children[2].innerHTML += tr
				})
				tabelaTP.classList.remove('hidden')
			} else {
				alerta('Não foi encontrado registro para o TP ' + numTP, () => {
					gridTPBusca.classList.remove('hidden')
					tabelaTP.classList.add('hidden')
				})
			}
			document.querySelector('.processando2').classList.add('hidden')
		})
		.catch(e => {
			alerta(e.message, null, true)
		})
}

// MENU BUSCA

element('btn-b-tp').addEventListener('click', e => {
	abrirBusca(buscaTP, e.target)
	tabelaTP.classList.add('hidden')
	gridTPBusca.classList.remove('hidden')
	gridTPBusca.innerHTML = ''
	realtime
		.ref('tps')
		.once('value')
		.then(snap => {
			var tps = Object.values(snap.val())
			tps.map(tp => {
				var item = `
				<div onclick='buscarTP(${tp.tp})'>${tp.tp}</div>
			`
				gridTPBusca.innerHTML += item
			})
		})
		.catch(e => () => {
			alerta(e.message, null, true)
		})
})

// BUSCA POR MATRICULA
var tabelaMatricula = document.getElementById('tabela-matricula')

element('btn-b-matricula').addEventListener('click', e => {
	document.querySelector('.form-matricula-buscar').classList.remove('hidden')
	abrirBusca(buscaMatricula, e.target)
	setTimeout(() => {
		document.querySelector('#input-matricula-buscar').focus()
	}, 200)
	document.querySelector('#btn-buscar-matricula').addEventListener('click', buscarMatricula)
	document.querySelector('#input-matricula-buscar').addEventListener('keyup', e => {
		if (e.target.value.length > 2) {
			var key = e.which || e.keyCode
			if (key == 13) {
				buscarMatricula()
			}
		}
	})
})

function buscarMatricula() {
	var matricula = document.querySelector('#input-matricula-buscar')
	if (matricula.value.length > 2) {
		tabelaMatricula.classList.add('hidden')
		document.querySelector('.processando').classList.remove('hidden')
		realtime
			.ref('historico')
			.once('value')
			.then(snap => {
				//var chaves = Object.keys(snap.val()).reverse()
				var historico = Object.values(snap.val())
				var encontrar = i => i.matricula == matricula.value
				var resultado = historico.reverse().filter(encontrar)
				if (resultado.length > 0) {
					ajustarHora().then(() => {
						var hora = new Date(new Date().getTime() + diferencaHora).toLocaleString()
						var resumoBusca = resultado.length + ' registros para a matrícula ' + matricula.value
						var horaDaBusca = `<br> Busca realizada em ${hora}`
						tabelaMatricula.children[0].innerHTML = resumoBusca
						tabelaMatricula.children[0].innerHTML += horaDaBusca
						// var hora = new Date(new Date().getTime() + diferencaHora).toLocaleString()
						// var horaDaBusca = `Busca realizada em ${hora} <br> ${resultado.length} registros`
						// tabelaMatricula.children[0].innerHTML = horaDaBusca
					})
					document.querySelector('.form-matricula-buscar').classList.add('hidden')
					tabelaMatricula.children[2].innerHTML = ''
					resultado.map(registro => {
						var tr = `
						<tr class='tr-devolvido'>
						<td><strong>${registro.tp}</strong></td>
								<td>${registro.status}</td>
								<td>${new Date(registro.data).toLocaleDateString()}</td>
								<td>${new Date(registro.data).toLocaleTimeString()}</td>
								<td>${registro.id}</td>
								<td>${registro.gerente}</td>
								<td>${registro.posto}</td>
								</tr>
							`
						tabelaMatricula.children[2].innerHTML += tr
					})
					document.querySelector('.processando').classList.add('hidden')
					tabelaMatricula.classList.remove('hidden')
				} else {
					document.querySelector('.processando').classList.add('hidden')
					alerta('Não foi encontrado registro para a matrícula ' + matricula.value, () => {
						matricula.value = ''
						matricula.focus()
					})
				}
			})
	} else {
		alerta('Preencha corretamente', () => matricula.focus())
	}
}

// BUSCA POR GERENTE

var tabelaGerente = document.getElementById('tabela-gerente')

element('btn-b-gerente').addEventListener('click', e => {
	document.querySelector('.form-gerente-buscar').classList.remove('hidden')
	abrirBusca(buscaGerente, e.target)
	setTimeout(() => {
		element('input-gerente-buscar').focus()
	}, 200)
	element('btn-buscar-gerente').addEventListener('click', buscarGerente)
	element('input-gerente-buscar').addEventListener('keyup', e => {
		if (e.target.value.length > 2) {
			var key = e.which || e.keyCode
			if (key == 13) {
				buscarGerente()
			}
		}
	})
})

function buscarGerente() {
	var matricula = element('input-gerente-buscar')
	if (matricula.value.length > 2) {
		tabelaGerente.classList.add('hidden')
		element('processando-gerente').classList.remove('hidden')
		realtime
			.ref('historico')
			.once('value')
			.then(snap => {
				var historico = Object.values(snap.val())
				var encontrar = i => i.matricula_gerente == matricula.value
				var resultado = historico.reverse().filter(encontrar)
				if (resultado.length > 0) {
					ajustarHora().then(() => {
						var hora = new Date(new Date().getTime() + diferencaHora).toLocaleString()
						var resumoBusca = resultado.length + ' registros para a matrícula ' + matricula.value
						var horaDaBusca = `<br> Busca realizada em ${hora}`
						tabelaGerente.children[0].innerHTML = resumoBusca
						tabelaGerente.children[0].innerHTML += horaDaBusca
					})
					document.querySelector('.form-gerente-buscar').classList.add('hidden')
					tabelaGerente.children[2].innerHTML = ''
					resultado.map(registro => {
						var tr = `
						<tr class='tr-devolvido'>
						<td><strong>${registro.tp}</strong></td>
								<td>${registro.status}</td>
								<td>${new Date(registro.data).toLocaleDateString()}</td>
								<td>${new Date(registro.data).toLocaleTimeString()}</td>
								<td>${registro.id}</td>
								<td>${registro.gerente}</td>
								<td>${registro.posto}</td>
								</tr>
							`
						tabelaGerente.children[2].innerHTML += tr
					})
					element('processando-gerente').classList.add('hidden')
					tabelaGerente.classList.remove('hidden')
				} else {
					element('processando-gerente').classList.add('hidden')
					alerta('Não foi encontrado registro para a matrícula ' + matricula.value, () => {
						matricula.value = ''
						matricula.focus()
					})
				}
			})
	} else {
		alerta('Preencha corretamente', () => matricula.focus())
	}
}

// BUSCA POR DATA

var btnBuscarData = document.querySelector('#btn-buscar-data')
var tabelaData = document.getElementById('tabela-data')

element('btn-b-data').addEventListener('click', e => {
	abrirBusca(buscaData, e.target)
	tabelaData.classList.add('hidden')
	document.querySelector('.div-form-data').classList.remove('hidden')
	var dataInicial = document.querySelector('#data-inicial')
	var dataFinal = document.querySelector('#data-final')
	var inicio, fim
	var fuso = 10800000
	// 24 horas - 1 ms (23h59min59.9999s)
	var umDia = 1000 * 60 * 60 * 24 - 1
	dataInicial.addEventListener('input', () => {
		btnBuscarData.classList.remove('hidden')
		tabelaData.classList.add('hidden')
		dataFinal.value = dataInicial.value
		inicio = Date.parse(dataInicial.value) + fuso
		fim = Date.parse(dataInicial.value) + fuso + umDia
	})
	dataFinal.addEventListener('input', e => {
		if (dataInicial.value) {
			inicio = Date.parse(dataInicial.value) + fuso
			fim = Date.parse(dataFinal.value) + fuso + umDia
			if (inicio < fim) {
				btnBuscarData.classList.remove('hidden')
			} else {
				alerta('Data inicial deve ser menor que data final')
				btnBuscarData.classList.add('hidden')
			}
		} else {
			dataFinal.value = ''
			dataInicial.focus()
		}
	})
	btnBuscarData.addEventListener('click', e => {
		e.preventDefault()
		btnBuscarData.classList.add('hidden')
		tabelaData.classList.add('hidden')
		document.querySelector('.processando3').classList.remove('hidden')
		realtime
			.ref('historico')
			.once('value')
			.then(snap => {
				var historico = Object.values(snap.val())
				var dataBusca = i => i.data >= inicio && i.data <= fim
				var registrosEncontrados = historico.filter(dataBusca)
				if (registrosEncontrados.length > 0) {
					document.querySelector('.div-form-data').classList.add('hidden')
					document.querySelector('.processando3').classList.add('hidden')
					ajustarHora().then(() => {
						var hora = new Date(new Date().getTime() + diferencaHora).toLocaleString()
						var resumoBusca =
							registrosEncontrados.length +
							' registros entre ' +
							new Date(inicio).toLocaleString() +
							' e ' +
							new Date(fim).toLocaleString()
						var horaDaBusca = `<br> Busca realizada em ${hora}`
						tabelaData.children[0].innerHTML = resumoBusca
						tabelaData.children[0].innerHTML += horaDaBusca
					})
					tabelaData.children[2].innerHTML = ''
					registrosEncontrados.map(registro => {
						var tr = `
					<tr class='tr-devolvido'>
					<td><strong>${registro.tp}</strong></td>
					<td>${registro.status}</td>
					<td>${new Date(registro.data).toLocaleDateString()}</td>
					<td>${new Date(registro.data).toLocaleTimeString()}</td>
					<td>${registro.id}</td>
					<td>${registro.gerente}</td>
					<td>${registro.posto}</td>
					</tr>
					`
						tabelaData.children[2].innerHTML += tr
					})
					tabelaData.classList.remove('hidden')
					//console.log(registrosEncontrados)
				} else {
					alerta(
						'Não foram encontrados registros para o período entre ' +
							new Date(inicio).toLocaleString() +
							' e ' +
							new Date(fim).toLocaleString()
					)
					document.querySelector('.processando3').classList.add('hidden')
					document.querySelector('.div-form-data').classList.remove('hidden')
				}
			})
			.catch(e => alerta(e.message, null, true))
		//alerta(new Date(inicio).toLocaleString() + ' | ' + new Date(fim).toLocaleString())

		//tabelaData.classList.remove('hidden')
	})
})

// SENHAS
var matriculaEsqueci = document.querySelector('#input-matricula-esqueci')

function limparSenha() {
	senhaLogin.value = ''
	matriculaLogin.value = ''
	matriculaEsqueci.value = ''
}

function abrirSenha(tipo, botao) {
	var senhas = Array.from(document.querySelector('.canvas-senha').children)
	senhas.map(tela => (tela.style.display = 'none'))
	tipo.style.display = 'flex'
	limparSenha()
	var botoesSenha = Array.from(document.querySelectorAll('.btn-s'))
	botoesSenha.map(i => i.classList.remove('btn-s-active'))
	botao.classList.add('btn-s-active')
}

// ESQUECI

document.querySelector('#menu-senha').children[0].addEventListener('click', e => {
	var esqueci = document.querySelector('.senha-esqueci')
	var btnEsqueci = document.querySelector('#btn-s-esqueci')
	abrirSenha(esqueci, btnEsqueci)
	var btnEnviarEsqueci = document.querySelector('#btn-enviar-esqueci')
	btnEnviarEsqueci.addEventListener('click', e => {
		var active = true
		function disable() {
			if (active) {
				e.target.setAttribute('disabled', true)
				e.target.innerText = 'Enviando...'
				matriculaEsqueci.style.color = 'grey'
				main.classList.add('disable')
				active = false
			} else {
				e.target.removeAttribute('disabled')
				e.target.innerText = 'ENVIAR'
				matriculaEsqueci.style.color = '#173d72'
				main.classList.remove('disable')
				active = true
			}
		}
		if (matriculaEsqueci.value.length > 2) {
			disable()
			realtime
				.ref('usuarios')
				.once('value')
				.then(snap => {
					var usuarios = Object.values(snap.val())
					var encontrarUsuario = i => i.matricula == matriculaEsqueci.value
					var usuarioEncontrado = usuarios.find(encontrarUsuario)
					if (usuarioEncontrado != undefined) {
						var novaSenha = Math.random().toString().slice(3, 7)
						realtime
							.ref('usuarios/' + usuarioEncontrado.email.split('@')[0].replace('.', '_') + '/p')
							.set(novaSenha * 1993)
							.then(() => {
								id = usuarioEncontrado.id
								chave = realtime.ref().child('usuarios').push().key
								mensagem = 'Utilize o código ' + novaSenha + ' como senha provisória.'
								email = usuarioEncontrado.email
								fetchUrl = url_mail + '?mensagem=' + mensagem + '&email=' + email + '&chave=' + chave
								fetch(encodeURI(fetchUrl), header)
									.then(response => {
										console.log(response)
										alerta('Senha enviada para ' + usuarioEncontrado.email, null, true)
										btnEnviarEsqueci.innerText = 'ENVIAR'
									})
									.catch(e => alerta('Erro ao enviar e-mail: ' + e, null, true))
							})
							.catch(e => alerta(e.message, null, true))
					} else {
						disable()
						alerta('Matrícula ' + matriculaEsqueci.value + ' não encontrada')
					}
				})
				.catch(e => alerta(e.message, null, true))
		} else {
			alerta('Preencha corretamente')
		}
	})
})

// ATUALIZAR
var matriculaLogin = document.querySelector('#input-matricula-login')
var senhaLogin = document.querySelector('#input-senha-login')
var btnEntrar = document.querySelector('#btn-entrar')

var clickAtualizar = 0
document.querySelector('#menu-senha').children[1].addEventListener('click', e => {
	var atualizar = document.querySelector('.senha-atualizar')
	var btnAtualizar = document.querySelector('#btn-s-atualizar')
	abrirSenha(atualizar, btnAtualizar)
	if (clickAtualizar == 0) {
		matriculaLogin.addEventListener('focus', e => {
			senhaLogin.value = ''
		})
		matriculaLogin.addEventListener('input', e => {
			if (e.target.value.length == 5) {
				senhaLogin.focus()
			}
		})
		matriculaLogin.addEventListener('keyup', e => {
			var key = e.which || e.keyCode
			if (key == 156 || key == 157) {
				e.target.value = ''
			}
		})

		senhaLogin.addEventListener('input', e => {
			if (e.target.value.length == 4) {
				e.target.blur()
			}
		})
		senhaLogin.addEventListener('keyup', e => {
			var key = e.which || e.keyCode
			if (key == 156 || key == 157) {
				e.target.value = ''
			}
		})

		btnEntrar.addEventListener('click', e => {
			var active = true
			function disable() {
				if (active) {
					e.target.setAttribute('disabled', true)
					e.target.innerText = 'Aguarde...'
					matriculaLogin.style.color = 'grey'
					senhaLogin.style.color = 'grey'
					main.classList.add('disable')
					active = false
				} else {
					e.target.removeAttribute('disabled')
					e.target.innerText = 'ENTRAR'
					matriculaLogin.style.color = '#173d72'
					senhaLogin.style.color = '#173d72'
					main.classList.remove('disable')
					active = true
				}
			}
			if (matriculaLogin.value.length > 2 && senhaLogin.value.length == 4) {
				disable()
				realtime
					.ref('usuarios')
					.once('value')
					.then(snap => {
						var usuarios = Object.values(snap.val())
						var encontrarUsuario = i => i.matricula == matriculaLogin.value
						var usuarioEncontrado = usuarios.find(encontrarUsuario)
						if (usuarioEncontrado != undefined) {
							if (usuarioEncontrado.p / 1993 == senhaLogin.value) {
								e.target.style.display = 'none'
								disable()
								document.querySelector('.menu-senha').classList.add('disable')
								title.style.pointerEvents = 'none'
								document.querySelector('.form-atualizar').querySelector('span').innerText = usuarioEncontrado.id
								setTimeout(() => {
									matriculaLogin.focus()
								}, 500)
								matriculaLogin.value = ''
								matriculaLogin.setAttribute('maxlength', 4)
								//matriculaLogin.setAttribute('type', 'password')
								matriculaLogin.classList.add('disc')
								document.querySelectorAll('.nova-senha')[0].classList.remove('hidden')
								document.querySelectorAll('.nova-senha')[1].classList.remove('hidden')
								matriculaLogin.style.letterSpacing = '4pt'
								document.querySelector('#div-matricula-login').querySelector('label').style.display = 'none'
								document.querySelector('#div-senha-login').querySelector('label').style.display = 'none'
								senhaLogin.value = ''
								document.querySelector('#div-botoes-atualizar').classList.remove('hidden')
								document.querySelector('#btn-atualizar').addEventListener('click', e => {
									if (matriculaLogin.value.length == 4 && senhaLogin.value.length == 4) {
										if (matriculaLogin.value == senhaLogin.value) {
											//main.classList.add('disable')
											disable()
											document.querySelector('#btn-cancelar').setAttribute('disabled', true)
											e.target.setAttribute('disabled', true)
											e.target.innerText = 'Aguarde...'
											realtime
												.ref('usuarios/' + usuarioEncontrado.email.split('@')[0].replace('.', '_') + '/p')
												.set(senhaLogin.value * 1993)
												.then(() => {
													ajustarHora().then(() => {
														chave = realtime.ref().child('usuarios').push().key
														mensagem =
															'Sua senha foi alterada em ' +
															new Date(new Date().getTime() + diferencaHora).toLocaleString() +
															' no posto ' +
															posto +
															'. Caso não tenha alterado sua senha, favor entrar em contato com a Gerência.'
														email = usuarioEncontrado.email
														fetchUrl = url_mail + '?mensagem=' + mensagem + '&email=' + email + '&chave=' + chave
														fetch(encodeURI(fetchUrl), header).then(() => {
															alerta('Senha atualizada com sucesso', null, true)
														})
													})
												})
												.catch(e => alerta(e.message, null, true))
										} else {
											alerta('Senhas não conferem')
										}
									} else {
										alerta('Preencha corretamente')
									}
								})
								//document.querySelector('#div-senha-login').querySelector('label').innerText = 'Nova senha'
							} else {
								disable()
								alerta('Senha incorreta', function () {
									senhaLogin.value = ''
									senhaLogin.focus()
								})
							}
						} else {
							alerta('Matrícula ' + matriculaLogin.value + ' não encontrada')
							disable()
						}
					})
					.catch(e => alerta(e.message, null, true))
			} else {
				alerta('Preencha corretamente')
			}
		})

		clickAtualizar++
	}
})

