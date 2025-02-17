export const convertUploadFileToURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = function() {
      resolve({
        file: file,
        url: reader.result,
      })
    }
    reader.readAsDataURL(file)
  })
}
