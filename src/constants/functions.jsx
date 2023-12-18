function customNumberInputHandler(event) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    const value = event.target.value;

    // Check if the key pressed is not allowed
    if (!allowedKeys.includes(event.key) && event.key !== 'Backspace') {
        event.preventDefault();
        return;
    }

    // Allow only one decimal point
    if (event.key === '.' && value.includes('.')) {
        event.preventDefault();
        return;
    }

    // Allow max 4 digits (excluding the decimal point)
    const numericPart = value.replace('.', '');
    if (numericPart.length >= 3 && event.key !== 'Backspace') {
        event.preventDefault();
        return;
    }
}

export { customNumberInputHandler }