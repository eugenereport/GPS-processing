export class GPSConfig {
    constructor(formElement, validator, callback) {
        this.formElement = formElement;
        this.validator = validator;
        this.callback = callback;
        this.configs = new Map();
        this.formElement.addEventListener("submit", this.handleSubmit.bind(this));
    }

    // Handles form submission
    handleSubmit(event) {
        event.preventDefault();

        this.clearErrors();

        const formData = this.createConfigObject();
   
        if (formData) {
            this.callback(formData);
        }
    }

    // Creates a configuration object from form inputs
    createConfigObject() {
        const inputContainers =
            this.formElement.querySelectorAll(".inputContainer");
        let hasError = false;

        inputContainers.forEach((container) => {

            const input = container.querySelector("input");
            const errorContainer = container.querySelector(".error");
            const configKey = container.getAttribute("data-config");

            if (input) {
                const value = input.value.trim();

                if (!this.validateField(input.name, value, errorContainer)) {
                    hasError = true;
                } else {
                    if (!this.configs.has(configKey)) {
                        this.configs.set(configKey, {});
                    }

                    this.addNestedConfig(this.configs.get(configKey), input.name, value);
                }
            }
        });

        return hasError ? null : this.getConfigObject();
    }

    // Adds nested configuration based on input names
    addNestedConfig(config, name, value) {

        const keys = name.split(".");
        let current = config;

        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            } else {
                if (!current[key]) {
                    current[key] = {};
                }
                current = current[key];
            }
        });
    }

    // Validates individual form fields
    validateField(fieldName, value, errorContainer) {

        const methodName = this.formElement
            .querySelector(`[name="${fieldName}"]`)
            .getAttribute("data-validation");

        if (typeof this.validator[methodName] === "function") {
            return this.validator[methodName](value, errorContainer);
        }

        errorContainer.innerText = "Unknown configuration";
        return false;
    }

    // Returns the final configuration object
    getConfigObject() {

        const result = {};
        this.configs.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }

    // Sets configuration values to the form fields
    setConfig(config) {

        const inputContainers =
            this.formElement.querySelectorAll(".inputContainer");

        inputContainers.forEach((container) => {

            const input = container.querySelector("input");
            const configKey = container.getAttribute("data-config");

            if (input && config[configKey]) {
                const nestedKeys = input.name.split(".");
                this.setNestedConfigValue(config[configKey], nestedKeys, input);
            }
        });
    }

    // Sets nested configuration values
    setNestedConfigValue(config, keys, input) {

        let current = config;

        keys.forEach((key, index) => {

            if (index === keys.length - 1) {

                input.value = current[key] || "";

            } else {

                current = current[key];

            }
        });
    }

    // Clears error messages in the form
    clearErrors() {

        const inputContainers =
            this.formElement.querySelectorAll(".inputContainer");

        inputContainers.forEach((container) => {

            const errorContainer = container.querySelector(".error");

            if (errorContainer) {
                errorContainer.innerText = "";
            }

        });
    }
}
