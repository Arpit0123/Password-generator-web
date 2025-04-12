document.addEventListener('DOMContentLoaded', (event) => {
    const inputSlider = document.querySelector("[data-lengthSlider]");
    const lengthDisplay = document.querySelector("[data-lengthNumber]");
    const passwordDisplay = document.querySelector("[data-passwordDisplay]");
    const copyBtn = document.querySelector("[data-copy]");
    const copyMsg = document.querySelector("[data-copyMsg]");
    const uppercaseCheck = document.querySelector("#uppercase");
    const lowercaseCheck = document.querySelector("#lowercase");
    const numbersCheck = document.querySelector("#numbers");
    const symbolsCheck = document.querySelector("#symbols");
    const indicator = document.querySelector("[data-indicator]");
    const generateBtn = document.querySelector(".generate-button");
    const allCheckBox = document.querySelectorAll("input[type=checkbox]");

    // Verify if uppercaseCheck exists and is not null
    const hasUppercase = uppercaseCheck?.checked ?? false;

    const symbol = '~!@#$%^&*()_={}|:"<>?,./;[]';

    let password = "";
    let passwordLength = 10;
    let checkCount = 0;
    handleSlider();

    //set passwordLength
    function handleSlider() {
        inputSlider.value = passwordLength;
        lengthDisplay.innerText = passwordLength;
    }

    function setIndicator(color) {
        indicator.style.backgroundColor = color;
        indicator.style.boxShadow = `0px 0px 12px 2px ${color}`;
    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function generateRandomNumber() {
        return getRndInteger(0, 10);
    }

    function generateLowerCase() {
        return String.fromCharCode(getRndInteger(97, 123));
    }

    function generateUpperCase() {
        return String.fromCharCode(getRndInteger(65, 91));
    }

    function generateSymbol() {
        const randNum = getRndInteger(0, symbol.length);
        return symbol.charAt(randNum);
    }

    function calcStrength() {
        let hasUpper = hasUppercase;
        let hasLower = lowercaseCheck.checked;
        let hasNum = numbersCheck.checked;
        let hasSym = symbolsCheck.checked;

        if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
            setIndicator("#0f0");
        } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
            setIndicator("#ff0");
        } else {
            setIndicator("#f00");
        }
    }

    async function copyContent() {
        try {
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMsg.innerText = "copied";
        } catch (e) {
            copyMsg.innerText = "Failed";
        }

        //to make copy wala span visible
        copyMsg.classList.add("active");

        setTimeout(() => {
            copyMsg.classList.remove("active");
        }, 2000);
    }

    function shufflePassword(array) {
        //fisher yates method..
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        let str = "";
        array.forEach((el) => (str += el));
        return str;
    }

    function handleCheckBoxChange() {
        checkCount = 0;
        allCheckBox.forEach((checkbox) => {
            if (checkbox.checked)
                checkCount++;
        })

        //special condition
        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
    }

    allCheckBox.forEach((checkbox) => {
        checkbox.addEventListener('change', handleCheckBoxChange);
    })

    inputSlider.addEventListener('input', (e) => {
        passwordLength = e.target.value;
        handleSlider();
    })

    copyBtn.addEventListener('click', () => {
        if (passwordDisplay.value)
            copyContent();
    })

    
    generateBtn.addEventListener('click', () => {
        // If no checkboxes are selected, generate a default password with lowercase letters
        if (checkCount <= 0) {
            passwordLength = 10; // Set a default password length
            password = ""; // Clear the password
            
            // Generate the default password with lowercase letters
            for (let i = 0; i < passwordLength; i++) {
                password += generateLowerCase();
            }
            
            // Update the password display and exit the function
            passwordDisplay.value = password;
            return;
        }
        
        // Let's start the journey to find a new password
        // console.log("start the journey");

        // Remove old password
        password = "";

        // Let's put the stuff mentioned by checkboxes

        let funcArr = [];

        if (uppercaseCheck.checked)
            funcArr.push(generateUpperCase);
        
        if (lowercaseCheck.checked)
            funcArr.push(generateLowerCase);
        
        if (numbersCheck.checked)
            funcArr.push(generateRandomNumber);
        
        if (symbolsCheck.checked)
            funcArr.push(generateSymbol);

        // Compulsory addition
        for (let i = 0; i < funcArr.length; i++) {
            password += funcArr[i]();
        }
        // console.log("compulsory addition done");


        // Remaining addition
        for (let i = 0; i < passwordLength - funcArr.length; i++) {
            let randIndex = getRndInteger(0, funcArr.length);
            let selectedFunc = funcArr[randIndex];
            if (typeof selectedFunc === 'function') {
                password += selectedFunc();
            }
        }

        // Shuffle the password
        password = shufflePassword(Array.from(password));
        // console.log("shuffling done");

        // Display the password
        passwordDisplay.value = password;
        // console.log("UI addition done");

        // Strength 
        calcStrength();
    });
});
