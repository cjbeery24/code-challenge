export function useValidation() {

    function isEmail(value) {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value && value.length > 0 && !pattern.test(value)) {
            return "Invalid e-mail.";
        } else {
            return true;
        }
    }
    function isRequired (value) {
        return (!!value || value === 0) || "Required."
    }

    return {
        isEmail,
        isRequired,
    }
}
