const characterOnly = (inputText) => {
    if (inputText) {
        let patt = /^[A-Za-z]+$/;
        let result = patt.test(inputText);
        return result;
    } else {
        return true;
    }
}

const characterWithApostrophe = (inputText) => {
    if (inputText) {
        let patt = /^[A-Za-z]+$/;
        let result = patt.test(inputText);
        return result;
    } else {
        return true;
    }
}

const lastNameRegex = (inputText) => {
    if (inputText) {
        let patt = /^[a-zA-Z'.-]*$/;
        let result = patt.test(inputText);
        return result;
    } else {
        return true;
    }
}

const characterWithSpace = (inputText) => {
    if (inputText) {
        let patt = /^[A-Za-z ]+$/;
        let result = patt.test(inputText);
        return result;
    } else {
        return true;
    }
}

const numericOnly = (inputText) => {
    if (inputText) {
        let patt = /^[0-9]+$/;
        let result = patt.test(inputText);
        return result;
    } else {
        return true;
    }
}

const numeric_hash_Only = (inputText) => {
    if (inputText) {
        let patt = /^\d+-?\d*$/;
        let result = patt.test(inputText);
        return result;
    } else {
        return true;
    }
}

export {
    characterOnly,
    characterWithSpace,
    characterWithApostrophe,
    numericOnly,
    numeric_hash_Only,
    lastNameRegex,
}