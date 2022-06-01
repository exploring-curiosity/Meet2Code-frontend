const saveCanvas = () => {
    let canvas = document.getElementById('board');
    var imageName = prompt('Please enter Board name');
    var canvasDataURL = canvas.toDataURL();
    var a = document.createElement('a');
    a.href = canvasDataURL;
    a.download = imageName || 'drawing';
    a.click();
    a.remove();
}

export {saveCanvas};