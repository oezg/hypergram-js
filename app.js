let originalImage;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const transparency = document.getElementById('transparent');


document.getElementById('file-input')
    .addEventListener('change', event => {
        if (event.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onloadend = e => {
                const image = new Image();
                image.src = e.target.result;
                image.onload = () => {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0);
                    originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
                }
            }
        }
    });

document.getElementById('save-button')
    .addEventListener('click', function() {
        const tempLink = document.createElement('a');
        tempLink.download = 'result.png';
        tempLink.href = canvas.toDataURL();
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    });

[brightness, contrast, transparency].forEach(el => {
    el.addEventListener('change', function() {
        modifyImage(
            parseInt(brightness.value, 10),
            parseInt(contrast.value, 10),
            parseFloat(transparency.value),
        );
    });
});

function modifyImage(brightness, contrast, transparency) {
    const modifiedImage = new ImageData(originalImage.width, originalImage.height);
    const originalPixels = originalImage.data;
    const modifiedPixels = modifiedImage.data;
    for (let i = 0; i < originalPixels.length; i++) {
        if (i % 4 === 3) {
            modifiedPixels[i] = originalPixels[i] * transparency;
        } else {
            const factor = 259 * (255 + contrast) / (255 * (259 - contrast));
            modifiedPixels[i] = Truncate((factor * (originalPixels[i] - 128) + 128) + brightness);
        }
    }
    ctx.putImageData(modifiedImage, 0, 0);
}

function Truncate(x) {
    return x < 0 ? 0 : x > 255 ? 255 : x;
}