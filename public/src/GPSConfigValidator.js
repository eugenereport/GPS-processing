export class GPSConfigValidator {
    validateField(value, errorContainer) {
        errorContainer.innerText = "";

        if (!value) {
            errorContainer.innerText = "Це поле не може бути порожнім";
            return false;
        }

        return true;
    }

    validateBaseNumber(value, errorContainer) {
        if (isNaN(value) || Number(value) <= 0) {
            errorContainer.innerText = "Будь ласка, введіть дійсне число більше 0";
            return false;
        }
        return true;
    }

    validateBaseInt(value, errorContainer) {
        let result = this.validateBaseNumber(value, errorContainer);

        if (!Number.isInteger(Number(value))) {
            errorContainer.innerText = "Потрібне ціле число";
            return false;
        }

        return result;
    }
}
