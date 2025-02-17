'use strict'
import http from '@core/services/http'
import { extension } from './url'

export function printImage(url) {
  let options =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  const defaultOptions = Object.assign(
    {
      name: '_blank',
      specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
      replace: true,
      styles: [],
    },
    options
  )

  let name = defaultOptions.name,
    specs = defaultOptions.specs

  specs = specs.length > 0 ? specs.join(',') : ''

  console.log(url)

  let html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<title>Document</title>
			</head>
			<body>
        <div style="text-align: center;">
          <img src="${url}">
        </div>
			</body>
		</html>
	`

  let win = window.open('', name, specs)
  win.document.write(html)

  const img = new Image()
  img.src = url
  img.onload = function () {
    setTimeout(function () {
      win.document.close()
      win.focus()
      win.print()
      win.close()
    }, 1500)
  }
}

export function printDocument(url) {
  let iframe = document.getElementById('print')
  if (!iframe) {
    iframe = document.createElement('iframe')
  }

  iframe.style.display = 'none'
  iframe.src = url
  iframe.id = 'print'

  iframe.onload = () => {
    setTimeout(function () {
      iframe.contentWindow.addEventListener('afterprint', () => {
        document.body.removeChild(iframe)
      })

      iframe.contentWindow.focus()
      iframe.contentWindow.print()
    }, 500)
  }

  document.body.appendChild(iframe)
}

export async function print(url) {
  if (!url) return

  const ext = extension(url)

  if (/^http/gi.test(url)) {
    if (ext == 'pdf') {
      printDocument(url)
      return
    }

    printImage(url)
    return
  }

  const res = await http.get(
    `/uploads/file-export/download?type=labels&url=${url}`,
    { type: 'blob' }
  )

  if (!res || res.error) {
    throw res.error
  }

  const src = (window.webkitURL || window.URL).createObjectURL(res)

  if (ext == 'pdf') {
    printDocument(src)
    return
  }

  printImage(src)
  return
}
