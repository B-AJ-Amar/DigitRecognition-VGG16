document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const context = canvas.getContext('2d');
    const clearButton = document.getElementById('clearButton');
    const checkButton = document.getElementById('checkButton');
    const resultDiv = document.getElementById('result');
    const penSizeRange = document.getElementById('penSizeRange');
    const penSizeLabel = document.getElementById('penSizeLabel');

    let drawing = false;
    let penSize = penSizeRange.value;

    penSizeRange.addEventListener('input', () => {
        penSize = penSizeRange.value;
        penSizeLabel.textContent = penSize;
    });

    canvas.addEventListener('mousedown', () => {
        drawing = true;
        context.beginPath();
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
        context.closePath();
    });

    canvas.addEventListener('mousemove', draw);

    clearButton.addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        resultDiv.textContent = ''; // Clear any previous results
        context.fillStyle = 'white'; // Set fill style to white
        context.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with white
    });
    clearButton.click();
    checkButton.addEventListener('click', async (event) => {
        // event.preventDefault(); // Prevent any default action
    
        // Convert the canvas to a JPEG Blob
        const dataURL = canvas.toDataURL('image/jpg', 1.0); // 1.0 for maximum quality
        const blob = await (await fetch(dataURL)).blob(); // Convert base64 to Blob
        const formData = new FormData();
        formData.append('file', blob, 'drawing.jpg'); // Append the Blob as a JPEG file
    
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        });
    
        const result = await response.json();
        resultDiv.textContent = result.message; // Display the response message
        console.log(result);
    });
    
    function draw(event) {
        if (!drawing) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        context.lineWidth = penSize;
        context.lineCap = 'round';
        context.strokeStyle = '#000';

        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
    }
});
