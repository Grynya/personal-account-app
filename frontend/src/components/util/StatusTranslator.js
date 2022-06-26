module.exports.engNameToRuName = (engName) => {
    switch (engName.replace(/\s/g, "").toUpperCase()) {
        case "ACTIVE":
            return "Активен";
        case "NOTACTIVE":
            return "Не активен";
        case "WAITING":
            return "Ожидает";
        case "BLOCKED":
            return "Заблокирован";
        // case "Другое":
        //     return "Другое";
    }
}
module.exports.ruNameToEngName = (ruName) => {
    switch (ruName) {
        case "Активен":
            return "ACTIVE";
        case "Не активен":
            return "NOTACTIVE";
        case "Ожидает":
            return "WAITING";
        case "Заблокирован":
            return "BLOCKED";
        // case "Другое":
        //     return "Другое";
    }
}
