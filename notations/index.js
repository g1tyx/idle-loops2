const inputContainer = document.getElementById("inputContainer");

const parseWithoutE = function(value) {
    if (!value.match(/^[-+]?[,.0-9]*$/u)) {
        return null;
    }
    if (value === "") {
        return new Decimal(1);
    }
    if (value === "-") {
        return new Decimal(-1);
    }
    if (!value.match(/\d/u)) {
        return null;
    }
    return new Decimal(value.replace(/,/gu, ""));
};

const parse = function(value) {
    const stringParts = value.split("e");
    if (!stringParts[stringParts.length - 1].match(/\d/u)) {
        return null;
    }
    const numberParts = stringParts.map(parseWithoutE);
    if (numberParts.includes(null)) {
        return null;
    }
    return numberParts.reduceRight((a, b) => Decimal.pow(10, a.toNumber()).times(b));
};

const NotationDisplay = function NotationDisplay(notationClass) {
    const notation = new notationClass();
    const span = document.createElement("span");
    inputContainer.after(span);
    return {
        update(value) {
            const decimalValue = parse(value);
            const formatted = decimalValue === null ? "???" : notation.format(decimalValue, 2, 0);
            span.textContent = `${notation.name}: ${formatted}`;
        }
    };
};

const displays = (function() {
    const N = ADNotations;
    const notations = [
        N.ScientificNotation,
        N.EngineeringNotation,
        N.LettersNotation,
        N.StandardNotation,
        N.CancerNotation,
        N.MixedScientificNotation,
        N.MixedEngineeringNotation,
        N.LogarithmNotation,
        N.BracketsNotation,
        N.InfinityNotation,
        N.RomanNotation,
        N.DotsNotation,
        N.ZalgoNotation,
        N.HexNotation,
        N.ImperialNotation,
        N.ClockNotation,
        N.PrimeNotation,
        N.BarNotation,
        N.ShiNotation,
        N.BlindNotation
    ];
    return notations.reverse().map(n => new NotationDisplay(n));
}());

function updateValues() {
    const input = document.getElementById("number").value;
    ADNotations.Settings.exponentCommas.show = document.getElementById("commas").checked;
    for (const display of displays) {
        display.update(input);
    }
}

updateValues();